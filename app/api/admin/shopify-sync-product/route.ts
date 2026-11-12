import { supabase } from "@/lib/supabase";
import { shopifyProductSyncGraphQL } from "@/lib/shopify-product-sync";
import { randomUUID } from "node:crypto";

export const dynamic = "force-dynamic";

type MirVariant = {
  id: string;
  product_id: string;
  size_label: string | null;
  config: string | null;
  display_config_en: string | null;
  display_note_en: string | null;
  width_mm: number | null;
  length_mm: number | null;
  height_mm: number | null;
  price_rmb: number | null;
  retail_price_nzd: number | null;
  shopify_variant_id: string | null;
};

type ShopifyVariant = {
  id: string;
  title: string;
  price: string;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
};

type ShopifyProduct = {
  id: string;
  title: string;
  status: string;
  variants: {
    nodes: ShopifyVariant[];
  };
};

type ShopifyUserError = {
  field: string[] | null;
  message: string;
};

function throwUserErrors(
  errors: ShopifyUserError[] | undefined,
  operation: string
) {
  if (errors?.length) {
    throw new Error(
      `${operation}: ${errors
        .map((error) => error.message)
        .join("; ")}`
    );
  }
}

function variantLabel(variant: MirVariant): string {
  const label =
    variant.display_config_en?.trim() ||
    variant.size_label?.trim() ||
    variant.config?.trim() ||
    [
      variant.width_mm,
      variant.length_mm,
      variant.height_mm,
    ]
      .filter((value) => value != null && value > 0)
      .join(" × ");

  return label || "Default";
}

function variantPrice(variant: MirVariant): string {
  const price = Number(variant.retail_price_nzd);

  if (
    variant.retail_price_nzd == null ||
    !Number.isFinite(price) ||
    price <= 0
  ) {
    throw new Error(
      `Invalid or missing NZD retail price for MIR variant ${variant.id}. ` +
      "Please set and save its Individual Retail Price before syncing."
    );
  }

  return price.toFixed(2);
}

function uniqueLabels(variants: MirVariant[]) {
  const seen = new Set<string>();

  return variants.map((variant) => {
    const label = variantLabel(variant);

    if (seen.has(label)) {
      throw new Error(
        `Duplicate variant label "${label}". ` +
          "Please make the English variant labels unique before syncing."
      );
    }

    seen.add(label);

    return {
      variant,
      label,
    };
  });
}

const PRODUCT_VARIANTS_QUERY = `
  query GetProductVariants($id: ID!) {
    product(id: $id) {
      id
      title
      status
      variants(first: 250) {
        nodes {
          id
          title
          price
          selectedOptions {
            name
            value
          }
        }
      }
    }
  }
`;

const INVENTORY_VARIANTS_QUERY = `
  query GetInventoryVariants(
    $id: ID!,
    $locationId: ID!
  ) {
    product(id: $id) {
      variants(first: 250) {
        nodes {
          id
          title
          selectedOptions {
            name
            value
          }
          inventoryItem {
            id
            inventoryLevel(locationId: $locationId) {
              id
            }
          }
        }
      }
    }
  }
`;

const PRODUCT_CREATE_MUTATION = `
  mutation CreateProduct(
    $product: ProductCreateInput!
    $media: [CreateMediaInput!]
  ) {
    productCreate(
      product: $product
      media: $media
    ) {
      product {
        id
        title
        status
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const PRODUCT_UPDATE_MUTATION = `
  mutation UpdateProduct(
    $product: ProductUpdateInput!
  ) {
    productUpdate(product: $product) {
      product {
        id
        title
        status
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const VARIANTS_CREATE_MUTATION = `
  mutation CreateVariants(
    $productId: ID!
    $variants: [ProductVariantsBulkInput!]!
  ) {
    productVariantsBulkCreate(
      productId: $productId
      variants: $variants
    ) {
      productVariants {
        id
        title
        selectedOptions {
          name
          value
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const VARIANTS_UPDATE_MUTATION = `
  mutation UpdateVariants(
    $productId: ID!
    $variants: [ProductVariantsBulkInput!]!
  ) {
    productVariantsBulkUpdate(
      productId: $productId
      variants: $variants
    ) {
      productVariants {
        id
        title
        price
        selectedOptions {
          name
          value
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const INVENTORY_TRACKING_MUTATION = `
  mutation EnableInventoryTracking(
    $id: ID!,
    $input: InventoryItemInput!
  ) {
    inventoryItemUpdate(
      id: $id,
      input: $input
    ) {
      inventoryItem {
        id
        tracked
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const INVENTORY_ACTIVATE_MUTATION = `
  mutation ActivateInventory(
    $inventoryItemId: ID!,
    $locationId: ID!,
    $available: Int!,
    $idempotencyKey: String!
  ) {
    inventoryActivate(
      inventoryItemId: $inventoryItemId,
      locationId: $locationId,
      available: $available
    ) @idempotent(key: $idempotencyKey) {
      userErrors {
        field
        message
      }
    }
  }
`;

const INVENTORY_SET_MUTATION = `
  mutation SetInventory(
    $input: InventorySetQuantitiesInput!,
    $idempotencyKey: String!
  ) {
    inventorySetQuantities(
      input: $input
    ) @idempotent(key: $idempotencyKey) {
      userErrors {
        field
        message
      }
    }
  }
`;

const PRODUCT_BY_ID_QUERY = `
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      title
      status
    }
  }
`;

function findVariantByLabel(
  variants: ShopifyVariant[],
  label: string
) {
  return variants.find((variant) =>
    variant.selectedOptions.some(
      (option) =>
        option.name === "Configuration" &&
        option.value === label
    )
  );
}

async function syncVariantInventory(
  inventoryItemId: string,
  locationId: string,
  quantity: number,
  isActive: boolean
) {
  if (!isActive) {
    const result =
      await shopifyProductSyncGraphQL<{
        inventoryActivate: {
          userErrors: ShopifyUserError[];
        };
      }>(
        INVENTORY_ACTIVATE_MUTATION,
        {
          inventoryItemId,
          locationId,
          available: quantity,
          idempotencyKey: randomUUID(),
        }
      );

    throwUserErrors(
      result.inventoryActivate.userErrors,
      "Shopify inventory activation failed"
    );

    return;
  }

  const result =
    await shopifyProductSyncGraphQL<{
      inventorySetQuantities: {
        userErrors: ShopifyUserError[];
      };
    }>(
      INVENTORY_SET_MUTATION,
      {
        input: {
          name: "available",
          reason: "correction",
          quantities: [
            {
              inventoryItemId,
              locationId,
              quantity,
              changeFromQuantity: null,
            },
          ],
        },
        idempotencyKey: randomUUID(),
      }
    );

  throwUserErrors(
    result.inventorySetQuantities.userErrors,
    "Shopify inventory update failed"
  );
}

export async function POST(req: Request) {
  let productId = "";

  try {
    const body = await req.json();

    productId =
      typeof body.product_id === "string"
        ? body.product_id.trim()
        : "";

    if (!productId) {
      return Response.json(
        { error: "product_id is required" },
        { status: 400 }
      );
    }

    const inventoryQuantity = body.inventory_quantity;

if (
  typeof inventoryQuantity !== "number" ||
  !Number.isInteger(inventoryQuantity) ||
  inventoryQuantity < 0
) {
  return Response.json(
    { error: "inventory_quantity must be a non-negative integer" },
    { status: 400 }
  );
}

const inventoryLocationId =
  process.env.SHOPIFY_INVENTORY_LOCATION_ID;

if (!inventoryLocationId) {
  throw new Error(
    "Missing SHOPIFY_INVENTORY_LOCATION_ID"
  );
}

    const {
      data: product,
      error: productError,
    } = await supabase
      .from("products")
      .select(`
        id,
        sku_code,
        category_id,
        name,
        display_name_en,
        description,
        display_description_en,
        image_url,
        supplier_id,
        shopify_product_id
      `)
.eq("id", productId)
      .single();

    if (productError || !product) {
      throw new Error(
        productError?.message || "MIR product not found"
      );
    }

    if (!product.sku_code?.trim()) {
      throw new Error("Product SKU is required");
    }

        if (!product.category_id) {
      throw new Error(
        "Product category is required before Shopify sync"
      );
    }

    const {
      data: category,
      error: categoryError,
    } = await supabase
      .from("categories")
      .select("display_name")
      .eq("id", product.category_id)
      .single();

    if (categoryError || !category?.display_name?.trim()) {
      throw new Error(
        categoryError?.message ||
          "Category display name is missing"
      );
    }

    const shopifyProductType =
      category.display_name.trim();

    const title =
      product.display_name_en?.trim() ||
      product.name?.trim() ||
      product.sku_code;

    const description =
      product.display_description_en?.trim() ||
      product.description?.trim() ||
      "";

    const {
      data: variantsData,
      error: variantsError,
    } = await supabase
      .from("variants")
      .select(`
        id,
        product_id,
        size_label,
        config,
        display_config_en,
        display_note_en,
        width_mm,
        length_mm,
        height_mm,
        price_rmb,
        retail_price_nzd,
        shopify_variant_id
      `)
      .eq("product_id", productId)
      .order("created_at");

    if (variantsError) {
      throw new Error(variantsError.message);
    }

    const variants =
      (variantsData || []) as MirVariant[];

    if (!variants.length) {
      throw new Error(
        "This product has no variants. Sync is cancelled."
      );
    }

        // Validate all NZD retail prices before any Shopify operation.
    const invalidPriceVariants = variants.filter(
      (variant) =>
        variant.retail_price_nzd == null ||
        !Number.isFinite(Number(variant.retail_price_nzd)) ||
        Number(variant.retail_price_nzd) <= 0
    );

    if (invalidPriceVariants.length > 0) {
      throw new Error(
        "Shopify sync cancelled. The following variants have no valid NZD retail price: " +
        invalidPriceVariants
          .map((variant) => {
            const label = variantLabel(variant);
            return `${label} (ID: ${variant.id})`;
          })
          .join("; ") +
        ". Please calculate and save all variant retail prices first."
      );
    }

    const labeledVariants =
      uniqueLabels(variants);

    const {
      data: imagesData,
      error: imagesError,
    } = await supabase
      .from("product_images")
      .select("id, image_url, sort_order")
      .eq("product_id", productId)
      .order("sort_order", { ascending: true });

    if (imagesError) {
      throw new Error(imagesError.message);
    }

    const imageUrls = Array.from(
      new Set(
        [
          ...(imagesData || []).map(
            (image: { image_url: string | null }) =>
              image.image_url
          ),
          product.image_url,
        ].filter(
          (url): url is string =>
            typeof url === "string" &&
            /^https?:\/\//i.test(url.trim())
        ).map((url) => url.trim())
      )
    );

    await supabase
      .from("products")
      .update({
        shopify_sync_status: "syncing",
        shopify_sync_error: null,
      })
      .eq("id", productId);

    let shopifyProductId =
      product.shopify_product_id as string | null;

    let shopifyProduct: ShopifyProduct | null = null;

    // If MIR already has a Shopify ID, confirm it still exists.
    if (shopifyProductId) {
      const result =
        await shopifyProductSyncGraphQL<{
          product: ShopifyProduct | null;
        }>(
          PRODUCT_VARIANTS_QUERY,
          { id: shopifyProductId }
        );

      shopifyProduct = result.product;

      if (!shopifyProduct) {
        throw new Error(
          "Saved Shopify Product ID no longer exists. " +
            "No new product was created; check the Shopify ID first."
        );
      }
    }

    // CREATE: product remains unpublished by default.
    if (!shopifyProductId) {
      const productInput = {
        title,
        descriptionHtml: description
          ? `<p>${description
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/\n/g, "<br>")}</p >`
          : "",
        vendor: "MoveInReady",
        productType: shopifyProductType,
        status: "ACTIVE",
        productOptions: [
          {
            name: "Configuration",
            values: labeledVariants.map(
              ({ label }) => ({ name: label })
            ),
          },
        ],
      };

      const media = imageUrls.map((url) => ({
        originalSource: url,
        alt: title,
        mediaContentType: "IMAGE",
      }));

      const created =
        await shopifyProductSyncGraphQL<{
          productCreate: {
            product: {
              id: string;
              title: string;
              status: string;
            } | null;
            userErrors: ShopifyUserError[];
          };
        }>(
          PRODUCT_CREATE_MUTATION,
          {
            product: productInput,
            media,
          }
        );

      throwUserErrors(
        created.productCreate.userErrors,
        "Shopify product creation failed"
      );

      if (!created.productCreate.product) {
        throw new Error(
          "Shopify did not return the created product"
        );
      }

      shopifyProductId =
        created.productCreate.product.id;

      // Persist the product ID immediately. If a later step fails,
      // the next attempt can update this product instead of duplicating it.
      const { error: saveProductIdError } =
        await supabase
          .from("products")
          .update({
            shopify_product_id: shopifyProductId,
            shopify_status:
              created.productCreate.product.status,
          })
          .eq("id", productId);

if (saveProductIdError) {
        throw new Error(
          "Shopify product was created, but saving its ID to MIR failed: " +
            saveProductIdError.message
        );
      }
    } else {
      // UPDATE product details. Do not publish it.
      const updated =
        await shopifyProductSyncGraphQL<{
          productUpdate: {
            product: {
              id: string;
              title: string;
              status: string;
            } | null;
            userErrors: ShopifyUserError[];
          };
        }>(
          PRODUCT_UPDATE_MUTATION,
          {
            product: {
              id: shopifyProductId,
              title,
              descriptionHtml: description
                ? `<p>${description
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/\n/g, "<br>")}</p >`
                : "",
              vendor: "MoveInReady",
              productType: shopifyProductType,
            },
          }
        );

      throwUserErrors(
        updated.productUpdate.userErrors,
        "Shopify product update failed"
      );
    }

    // Read Shopify variants after product creation/update.
    const variantResult =
      await shopifyProductSyncGraphQL<{
        product: ShopifyProduct | null;
      }>(
        PRODUCT_VARIANTS_QUERY,
        { id: shopifyProductId }
      );

    if (!variantResult.product) {
      throw new Error(
        "Unable to retrieve Shopify variants"
      );
    }

    const shopifyVariants =
      variantResult.product.variants.nodes;

    const variantUpdates: Array<{
      id: string;
      price: string;
    }> = [];

    const variantsToCreate: Array<{
      price: string;
      optionValues: Array<{
        optionName: string;
        name: string;
      }>;
    }> = [];

    const localVariantForLabel = new Map(
      labeledVariants.map(({ label, variant }) => [
        label,
        variant,
      ])
    );

    const matchedShopifyIds = new Set<string>();

    for (const { variant, label } of labeledVariants) {
      let shopifyVariant =
        variant.shopify_variant_id
          ? shopifyVariants.find(
              (candidate) =>
                candidate.id ===
                variant.shopify_variant_id
            )
          : undefined;

      // If no saved ID exists, match by the option value.
      if (!shopifyVariant) {
        shopifyVariant =
          findVariantByLabel(
            shopifyVariants,
            label
          );
      }

      if (shopifyVariant) {
        matchedShopifyIds.add(
          shopifyVariant.id
        );

        variantUpdates.push({
          id: shopifyVariant.id,
          price: variantPrice(variant),
        });
      } else {
        variantsToCreate.push({
          price: variantPrice(variant),
          optionValues: [
            {
              optionName: "Configuration",
              name: label,
            },
          ],
        });
      }
    }

    // Update existing variants first.
    if (variantUpdates.length) {
      const updatedVariants =
        await shopifyProductSyncGraphQL<{
          productVariantsBulkUpdate: {
            productVariants: ShopifyVariant[];
            userErrors: ShopifyUserError[];
          };
        }>(
          VARIANTS_UPDATE_MUTATION,
          {
            productId: shopifyProductId,
            variants: variantUpdates,
          }
        );

      throwUserErrors(
        updatedVariants
          .productVariantsBulkUpdate.userErrors,
        "Shopify variant update failed"
      );
    }

    // Create missing variants.
    if (variantsToCreate.length) {
      const createdVariants =
        await shopifyProductSyncGraphQL<{
          productVariantsBulkCreate: {
            productVariants: ShopifyVariant[];
            userErrors: ShopifyUserError[];
          };
        }>(
          VARIANTS_CREATE_MUTATION,
          {
            productId: shopifyProductId,
            variants: variantsToCreate,
          }
        );

      throwUserErrors(
        createdVariants
          .productVariantsBulkCreate.userErrors,
        "Shopify variant creation failed"
      );
    }

    // Re-query all variants to obtain the definitive ID mapping.
    const finalResult =
      await shopifyProductSyncGraphQL<{
        product: ShopifyProduct | null;
      }>(
        PRODUCT_VARIANTS_QUERY,
        { id: shopifyProductId }
      );

    if (!finalResult.product) {
      throw new Error(
        "Unable to verify the final Shopify product"
      );
    }

    const finalShopifyVariants =
      finalResult.product.variants.nodes;

    const mappingErrors: string[] = [];

for (const [label, variant] of localVariantForLabel) {
      const shopifyVariant =
        finalShopifyVariants.find(
          (candidate) =>
            candidate.selectedOptions.some(
              (option) =>
                option.name === "Configuration" &&
                option.value === label
            )
        );

      if (!shopifyVariant) {
        mappingErrors.push(
          `${variant.id}: ${label}`
        );
        continue;
      }

      const { error: variantSaveError } =
        await supabase
          .from("variants")
          .update({
            shopify_variant_id:
              shopifyVariant.id,
          })
          .eq("id", variant.id);

      if (variantSaveError) {
        throw new Error(
          `Failed to save Shopify variant ID for ${variant.id}: ` +
            variantSaveError.message
        );
      }
    }

    if (mappingErrors.length) {
      throw new Error(
        "Some MIR variants could not be mapped to Shopify: " +
          mappingErrors.join(", ")
      );
    }

    // Reset every variant's available inventory.
const inventoryResult =
  await shopifyProductSyncGraphQL<{
    product: {
      variants: {
        nodes: Array<{
          id: string;
          title: string;
          selectedOptions: Array<{
            name: string;
            value: string;
          }>;
          inventoryItem: {
            id: string;
            inventoryLevel: {
              id: string;
            } | null;
          };
        }>;
      };
    } | null;
  }>(
    INVENTORY_VARIANTS_QUERY,
    {
      id: shopifyProductId,
      locationId: inventoryLocationId,
    }
  );

if (!inventoryResult.product) {
  throw new Error(
    "Unable to retrieve Shopify inventory variants"
  );
}

for (const { label } of labeledVariants) {
  const shopifyVariant =
    inventoryResult.product.variants.nodes.find(
      (candidate) =>
        candidate.selectedOptions.some(
          (option) =>
            option.name === "Configuration" &&
            option.value === label
        )
    );

  if (!shopifyVariant) {
    throw new Error(
      `Unable to find Shopify inventory variant: ${label}`
    );
  }

  const trackingResult =
  await shopifyProductSyncGraphQL<{
    inventoryItemUpdate: {
      userErrors: ShopifyUserError[];
    };
  }>(
    INVENTORY_TRACKING_MUTATION,
    {
      id: shopifyVariant.inventoryItem.id,
      input: {
        tracked: true,
      },
    }
  );

throwUserErrors(
  trackingResult.inventoryItemUpdate.userErrors,
  `Enable inventory tracking failed for ${label}`
);
  
  await syncVariantInventory(
    shopifyVariant.inventoryItem.id,
    inventoryLocationId,
    inventoryQuantity,
    shopifyVariant.inventoryItem.inventoryLevel !== null
  );
}

    const { error: finalSaveError } =
      await supabase
        .from("products")
        .update({
          shopify_product_id: shopifyProductId,
          shopify_status:
            finalResult.product.status,
          shopify_sync_status: "synced",
          shopify_synced_at:
            new Date().toISOString(),
          shopify_sync_error: null,
        })
        .eq("id", productId);

    if (finalSaveError) {
      throw new Error(
        "Product synced, but final status update failed: " +
          finalSaveError.message
      );
    }

    return Response.json({
      success: true,
      product_id: productId,
      shopify_product_id: shopifyProductId,
      shopify_status:
        finalResult.product.status,
      variants_synced: variants.length,
      images_submitted: imageUrls.length,
      inventory_quantity_per_variant: inventoryQuantity,
inventory_location_id: inventoryLocationId,
      message:
        "Product synced to Shopify as an unpublished product.",
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown Shopify sync error";

    console.error(
      "[Shopify Product Sync]",
      {
        productId,
        error: message,
      }
    );

    if (productId) {
      await supabase
        .from("products")
        .update({
          shopify_sync_status: "error",
          shopify_sync_error: message.slice(0, 2000),
        })
        .eq("id", productId);
    }

    return Response.json(
      {
        success: false,
        error: message,
        product_id: productId || null,
      },
      { status: 500 }
    );
  }
}