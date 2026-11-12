import { supabase } from "@/lib/supabase"
import { shopifyQuery } from "@/lib/shopify"
import ProductImages from "@/components/ProductImages"
import ShopifyTestPurchase from "@/components/ShopifyTestPurchase"
import { notFound } from "next/navigation"

type Props = {
  params: Promise<{ id: string }>
}

type ShopifyProductResult = {
  product: {
    id: string
    title: string
    description: string
    descriptionHtml: string
    handle: string
    availableForSale: boolean

    featuredImage: {
      url: string
      altText: string | null
    } | null

    images: {
      nodes: {
        url: string
        altText: string | null
      }[]
    }

    priceRange: {
      minVariantPrice: {
        amount: string
        currencyCode: string
      }
    }

    variants: {
      nodes: {
        id: string
        title: string
        availableForSale: boolean
        sku: string | null

        selectedOptions: {
          name: string
          value: string
        }[]

        price: {
          amount: string
          currencyCode: string
        }
      }[]
    }
  } | null
}



// ===== SEO Metadata =====
export async function generateMetadata({
  params,
}: Props) {

  const { id } = await params

  const { data: product } = await supabase
    .from("products")
    .select(`
      id,
      sku_code,
      display_name_en,
      display_description_en,
      image_url,
      category_id
    `)
    .eq("id", id)
    .single()

  if (!product) {
    return {
      title: "Product | MoveInReady",
    }
  }

  const { data: category } = await supabase
    .from("categories")
    .select("display_name")
    .eq("id", product.category_id)
    .single()

  const title =
    `${product.display_name_en || product.sku_code} | MoveInReady`

  const description =
    product.display_description_en ||
    `Explore curated furniture designed for modern New Zealand homes and move-in-ready living.`

  return {
    title,
    description,

    keywords: [
      product.display_name_en || product.sku_code,
      category?.display_name || "Furniture",
      "Furniture NZ",
      "Move In Ready",
      "Christchurch furniture",
      "Townhouse furniture",
      "Modern furniture NZ",
    ],

    openGraph: {
      title,
      description,
      images: [
        product.image_url || "/images/hero-image.jpg",
      ],
    },
  }
}

export default async function ProductPage({
  params,
}: Props) {

  const { id } = await params

  // ===== Product =====
const { data: product } = await supabase
  .from("products")
  .select("*")
  .eq("id", id)
  .single()

if (!product) {
  return notFound()
}

// ===== Shopify Product =====

if (!product.shopify_product_id) {
  notFound()
}

let shopifyData: ShopifyProductResult

try {
  shopifyData = await shopifyQuery<ShopifyProductResult>(
    `
      query GetMIRProduct($id: ID!) {
        product(id: $id) {
          id
          title
          description
          descriptionHtml
          handle
          availableForSale

          featuredImage {
            url
            altText
          }

          images(first: 20) {
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

          variants(first: 100) {
            nodes {
              id
              title
              availableForSale
              sku

              selectedOptions {
                name
                value
              }

              price {
                amount
                currencyCode
              }
            }
          }
        }
      }
    `,
    {
      id: product.shopify_product_id,
    }
  )
} catch {
  throw new Error("Unable to load Shopify product")
}

const shopifyProduct = shopifyData.product



if (!shopifyProduct) {
  notFound()
}

const images = shopifyProduct.images.nodes

const availableVariant = shopifyProduct.variants.nodes.find(
  (variant) => variant.availableForSale
)

const purchaseVariant =
  availableVariant || shopifyProduct.variants.nodes[0]
  
return (
  <main className="max-w-6xl mx-auto px-5 py-10">

    <div className="grid gap-10 md:grid-cols-2">

      {/* ===== Left Images ===== */}
      <section>
        <ProductImages
          images={images.map((image) => ({
            image_url: image.url,
            alt_text: image.altText,
          }))}
        />
      </section>

      {/* ===== Right Content ===== */}
      <section className="space-y-6">

        {/* ===== Title ===== */}
        <div>
          <h1 className="text-3xl font-semibold leading-tight">
            {shopifyProduct.title}
          </h1>

          <div className="text-sm text-gray-400 mt-2">
            SKU: {product.sku_code}
          </div>
        </div>

        {/* ===== Description ===== */}
        <div className="border-t pt-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-600">
            Product Description
          </h2>

          {shopifyProduct.descriptionHtml?.trim() ? (
            <div
              className="
                product-description
                leading-relaxed
                text-gray-700
                [&_h1]:text-2xl
                [&_h1]:font-bold
                [&_h1]:mb-4
                [&_h2]:text-xl
                [&_h2]:font-semibold
                [&_h2]:mb-3
                [&_h3]:text-lg
                [&_h3]:font-semibold
                [&_h3]:mb-2
                [&_p]:mb-3
                [&_ol]:list-decimal
                [&_ol]:pl-6
                [&_ol]:mb-4
                [&_ul]:list-disc
                [&_ul]:pl-6
                [&_ul]:mb-4
                [&_li]:pl-1
                [&_li]:mb-2
                [&_strong]:font-semibold
                [&_a]:underline
              "
              dangerouslySetInnerHTML={{
                __html: shopifyProduct.descriptionHtml,
              }}
            />
          ) : (
            <p className="whitespace-pre-line leading-relaxed text-gray-700">
              {shopifyProduct.description || "No description provided."}
            </p >
          )}
        </div>

        {/* ===== Product Options ===== */}
        <div className="border-t pt-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-600">
            Product Options
          </h2>

          <p className="text-sm text-gray-700">
            {shopifyProduct.variants.nodes
              .map((variant) => variant.title)
              .join(", ") || "Default variant"}
          </p >
        </div>

        {/* ===== Purchase ===== */}
        <div className="border-t pt-5">

{purchaseVariant ? (
  <ShopifyTestPurchase
    variantId={purchaseVariant.id}
    availableForSale={purchaseVariant.availableForSale}
    price={purchaseVariant.price.amount}
    currencyCode={purchaseVariant.price.currencyCode}
  />
) : (
  <p className="text-sm text-red-600">
    This product currently has no available variant.
  </p >
)}

        </div>

      </section>

    </div>
  </main>
)
}