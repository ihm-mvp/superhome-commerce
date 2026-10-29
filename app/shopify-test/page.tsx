import { notFound } from "next/navigation";
import { shopifyQuery } from "@/lib/shopify";
import ShopifyTestPurchase from "@/components/ShopifyTestPurchase";
import ProductImages from "@/components/ProductImages";

export const dynamic = "force-dynamic";

const TEST_PRODUCT_ID = "gid://shopify/Product/15469231308985";

type ShopifyProductResult = {
  product: {
    id: string;
    title: string;
    description: string;
    handle: string;
    availableForSale: boolean;
    featuredImage: {
      url: string;
      altText: string | null;
    } | null;
    images: {
      nodes: {
        url: string;
        altText: string | null;
      }[];
    };
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    variants: {
      nodes: {
        id: string;
        title: string;
        availableForSale: boolean;
        price: {
          amount: string;
          currencyCode: string;
        };
      }[];
    };
  } | null;
};

export async function generateMetadata() {
  return {
    title: "Smart Home Switch Module KMS1 | MoveInReady",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function ShopifyTestPage() {
  let data: ShopifyProductResult;

  try {
    data = await shopifyQuery<ShopifyProductResult>(
      `
        query GetTestProduct($id: ID!) {
          product(id: $id) {
            id
            title
            description
            handle
            availableForSale
            featuredImage {
              url
              altText
            }
            images(first: 10) {
              nodes {
                url
                altText
              }
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            variants(first: 10) {
              nodes {
                id
                title
                availableForSale
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      `,
      { id: TEST_PRODUCT_ID }
    );
  } catch {
    throw new Error(
      "Unable to load the product. Check the server logs."
    );
  }

  const product = data.product;

  if (!product) {
    notFound();
  }

  const images = product.images.nodes;
  const featuredImage = product.featuredImage ?? images[0] ?? null;

  const availableVariant = product.variants.nodes.find(
    (variant) => variant.availableForSale
  );

  const price = availableVariant?.price ?? product.priceRange.minVariantPrice;

  return (
    <main className="max-w-6xl mx-auto px-5 py-10">

      <div className="grid gap-10 md:grid-cols-2">

<section>
  <ProductImages
    images={images.map((image) => ({
      image_url: image.url,
      alt_text: image.altText,
    }))}
  />
</section>

        <section className="space-y-6">
          <div>

            <h1 className="text-3xl font-semibold leading-tight">
              {product.title}
            </h1>

          </div>

          <div className="border-t pt-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-600">
              Product Description
            </h2>

            <p className="whitespace-pre-line leading-relaxed text-gray-700">
              {product.description || "No description provided."}
            </p >
          </div>

          <div className="border-t pt-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-600">
              Product Options
            </h2>

            <p className="text-sm text-gray-700">
              {product.variants.nodes.map((variant) => variant.title).join(", ") ||
                "Default variant"}
            </p >
          </div>

          {availableVariant ? (
            <ShopifyTestPurchase
              variantId={availableVariant.id}
              availableForSale={availableVariant.availableForSale}
              price={availableVariant.price.amount}
              currencyCode={availableVariant.price.currencyCode}
            />
          ) : (
            <div className="border-t pt-5">
              <p className="text-sm text-red-600">
                This product currently has no available variant.
              </p >
            </div>
          )}
        </section>
      </div>
    </main>
  );
}