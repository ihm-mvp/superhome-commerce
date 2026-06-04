import { supabase } from "@/lib/supabase"
import ProductImages from "@/components/ProductImages"
import { notFound } from "next/navigation"

type Props = {
  params: Promise<{ id: string }>
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

  // ===== Images =====
  const { data: images } = await supabase
    .from("product_images")
    .select("image_url, sort_order")
    .eq("product_id", id)

  const sortedImages = (images || []).sort(
    (a: any, b: any) =>
      (a.sort_order || 0) - (b.sort_order || 0)
  )

  // ===== Supplier =====
  const { data: supplier } = await supabase
    .from("suppliers")
    .select("name")
    .eq("id", product.supplier_id)
    .single()

  // ===== Category =====
  const { data: category } = await supabase
    .from("categories")
    .select("display_name")
    .eq("id", product.category_id)
    .single()

  // ===== Variants =====
  const { data: variants } = await supabase
    .from("variants")
    .select("*")
    .eq("product_id", id)

  // ===== Product Fields =====
  const hiddenProductFields = [
    "id",
    "image_url",
    "created_at",
    "category_id",
    "supplier_id",
    "level",
    "name",
    "description",
    "display_name_en",
    "display_description_en",
  ]

  const fieldMap: Record<string, string> = {
    sku_code: "SKU",
    usage_type: "Usage",
  }

  const safeProduct = product as Record<string, any>

  const displayFields = Object.entries(safeProduct)
    .filter(
      ([key, value]) =>
        !hiddenProductFields.includes(key) &&
        value !== null &&
        value !== ""
    )
    .map(([key, value]) => ({
      label:
        fieldMap[key] ||
        key.replace(/_/g, " "),
      value: String(value),
    }))

  // ===== Inject Category =====
  if (category?.display_name) {
    displayFields.unshift({
      label: "Category",
      value: category.display_name,
    })
  }

  // ===== Inject Supplier =====


  return (
    <div className="max-w-6xl mx-auto p-8 grid md:grid-cols-2 gap-10">

      {/* ===== Left Images ===== */}
      <div>
        <ProductImages images={sortedImages} />
      </div>

      {/* ===== Right Content ===== */}
      <div className="space-y-6">

        {/* ===== Title ===== */}
        <div className="space-y-2">

          <h1 className="text-3xl font-semibold leading-tight">
            {product.display_name_en || product.sku_code}
          </h1>

          <div className="text-sm text-gray-400">
            SKU: {product.sku_code}
          </div>

        </div>

        {/* ===== Description ===== */}
        {product.display_description_en && (
          <div className="text-gray-600 whitespace-pre-line leading-relaxed border-t pt-5">
            {product.display_description_en}
          </div>
        )}

{/* ===== Product Details ===== */}
        <div className="border-t pt-5">

          <h2 className="text-sm font-semibold mb-4 text-gray-600 uppercase tracking-wide">
            Product Details
          </h2>

          <div className="space-y-2">

            {displayFields.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between text-sm border-b pb-2 gap-4"
              >

                <span className="text-gray-500 whitespace-nowrap">
                  {item.label}
                </span>

                <span className="text-gray-800 text-right">
                  {item.value}
                </span>

              </div>
            ))}

          </div>

        </div>

        {/* ===== Variants ===== */}

{variants && variants.length > 0 && (
  <div className="border-t pt-5">

    <h2 className="text-sm font-semibold mb-4 text-gray-600 uppercase tracking-wide">
      Options
    </h2>

    <div className="space-y-3">

      {variants.map((v: any) => {

        const hasSize =
          v.width_mm ||
          v.length_mm ||
          v.height_mm

        const hasConfig =
          v.display_config_en || v.config

        if (!hasSize && !hasConfig) {
          return null
        }

        return (
          <div
            key={v.id}
            className="border rounded-xl p-4 text-sm space-y-2 bg-gray-50"
          >

            {/* ===== Config ===== */}
            {hasConfig && (
              <div className="space-y-1">

                <div className="font-medium text-gray-800">
                  {v.display_config_en || v.config}
                </div>

                {v.display_note_en && (
                  <div className="text-xs text-gray-500">
                    {v.display_note_en}
                  </div>
                )}

              </div>
            )}

            {/* ===== Size ===== */}
            {hasSize && (
              <div className="flex justify-between gap-4 text-sm">

                <span className="text-gray-500">
                  Size
                </span>

                <span className="text-right">
                  {v.width_mm || "-"} ×{" "}
                  {v.length_mm || "-"} ×{" "}
                  {v.height_mm || "-"} mm
                </span>

              </div>
            )}

          </div>
        )
      })}

    </div>

  </div>
)}


      </div>

    </div>
  )
}