
import { supabase } from "@/lib/supabase"
import { shopifyQuery } from "@/lib/shopify"
import ProductImages from "@/components/ProductImages"
import ShopifyProductPurchase from "@/components/ShopifyProductPurchase"
import Link from "next/link"
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
      title: "Home Product | MoveInReady",
    }
  }

  const { data: category } = await supabase
    .from("categories")
    .select("display_name")
    .eq("id", product.category_id)
    .single()

  const categoryName =
    category?.display_name || "Home Products"

  const productName =
    product.display_name_en || product.sku_code

  const title =
    `${productName} | ${categoryName} | MoveInReady`

  const description =
    product.display_description_en ||
    `Discover ${productName} at MoveInReady. Explore home products selected for better everyday living in New Zealand.`

  return {
    title,
    description,

    keywords: [
      productName,
      categoryName,
      `${categoryName} NZ`,
      "Home Products NZ",
      "MoveInReady",
      "New Zealand home products",
      "Better everyday living",
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

  // ===== Category =====
  const { data: category } = await supabase
    .from("categories")
    .select("display_name, slug")
    .eq("id", product.category_id)
    .single()

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

  return (
    <main className="max-w-6xl mx-auto px-5 py-8 md:py-10 space-y-6">

      {/* ===== Breadcrumb ===== */}
      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-400">

        <Link
          href="/products"
          className="hover:text-black transition"
          prefetch={false}
        >
          Products
        </Link>

        {category && (
          <>
            <span>/</span>

 <Link
              href={`/products/category/${category.slug}`}
              className="hover:text-black transition"
              prefetch={false}
            >
              {category.display_name}
            </Link>
          </>
        )}

        <span>/</span>

        <span className="text-gray-600 line-clamp-1">
          {shopifyProduct.title}
        </span>

      </div>


      {/* ===== Product Layout ===== */}
      <div className="grid gap-8 md:gap-10 md:grid-cols-2">

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

          {/* ===== Product Title ===== */}
          <div>

            <h1 className="text-2xl md:text-3xl font-semibold leading-tight">
              {shopifyProduct.title}
            </h1>

            <div className="text-xs text-gray-400 mt-2">
              SKU: {product.sku_code}
            </div>

          </div>


          {/* ===== Purchase ===== */}
          <div className="border-t border-b py-5 space-y-4">

            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
              Select Options & Purchase
            </h2>

            {shopifyProduct.variants.nodes.length > 0 ? (
              <ShopifyProductPurchase
                variants={shopifyProduct.variants.nodes}
              />
            ) : (
              <p className="text-sm text-red-600">
                This product currently has no available variant.
              </p >
            )}

          </div>


          {/* ===== Product Description ===== */}
          <div className="space-y-3">

            <h2 className="text-lg font-semibold">
              Product Details
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

        </section>

      </div>

    </main>
  )
}