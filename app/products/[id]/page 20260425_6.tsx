import { supabase } from "@/lib/supabase"

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  // ===== 产品 =====
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single()

  if (!product) {
    return <div className="p-10">Not found</div>
  }

  // ===== 图片 =====
  const { data: images } = await supabase
    .from("product_images")
    .select("image_url, sort_order")
    .eq("product_id", id)

  const sortedImages = (images || []).sort(
    (a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0)
  )

  const mainImage =
    sortedImages.length > 0
      ? sortedImages[0].image_url
      : product.image_url

  // ===== 外键 =====
  const { data: supplier } = await supabase
    .from("suppliers")
    .select("name")
    .eq("id", product.supplier_id)
    .single()

  const { data: category } = await supabase
    .from("categories")
    .select("name")
    .eq("id", product.category_id)
    .single()

  // ===== variants =====
  const { data: variants } = await supabase
    .from("variants")
    .select("*")
    .eq("product_id", id)

  // ===== hiddenFields（核心）=====
  const hiddenFields = {
    product: ["id", "image_url", "created_at", "category_id", "supplier_id", "level"],
    variant: ["id", "product_id", "price", "created_at"]
  }

  // ===== 字段映射 =====
  const fieldMap: Record<string, string> = {
    sku_code: "SKU",
    name: "Name",
    usage_type: "Usage",
  }

  const safeProduct = product as Record<string, any>

  const displayFields = Object.entries(safeProduct)
    .filter(
      ([key, value]) =>
        !hiddenFields.product.includes(key) &&
        value !== null &&
        value !== ""
    )
    .map(([key, value]) => ({
      label: fieldMap[key] || key.replace(/_/g, " "),
      value: String(value),
    }))

  // 👉 插入品牌 & 分类
  if (supplier?.name) {
    displayFields.unshift({ label: "Brand", value: supplier.name })
  }

  if (category?.name) {
    displayFields.unshift({ label: "Category", value: category.name })
  }

  return (
    <div className="max-w-6xl mx-auto p-8 grid md:grid-cols-2 gap-10">

      {/* 左：图片 */}
      <div>
        <div className="bg-gray-100 rounded-xl flex items-center justify-center p-6">
          < img src={mainImage} className="max-h-[400px] object-contain" />
        </div>

        {sortedImages.length > 1 && (
          <div className="flex gap-3 mt-4 flex-wrap">
            {sortedImages.map((img: any) => (
              <img
                key={img.image_url}
                src={img.image_url}
                className="w-16 h-16 object-contain border rounded-md"
              />
            ))}
          </div>
        )}
      </div>

      {/* 右：信息 */}
      <div className="space-y-6">

        {/* 标题 */}
        <div>
          <h1 className="text-3xl font-semibold">
            {product.sku_code}
          </h1>

          {product.name && (
            <div className="text-gray-500 text-sm mt-1">
              {product.name}
            </div>
          )}
        </div>

        {/* 描述 */}
        {product.description && (
          <div className="text-gray-600 whitespace-pre-line text-sm border-t pt-4">
            {product.description}
          </div>
        )}

        {/* Product Details */}
        <div className="border-t pt-4">
          <h2 className="text-sm font-semibold mb-3 text-gray-600">
            Product Details
          </h2>

          <div className="space-y-2">
            {displayFields.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm border-b pb-1">
                <span className="text-gray-500">{item.label}</span>
                <span className="text-gray-800 text-right max-w-[60%]">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Variants */}
        {variants && variants.length > 0 && (
          <div className="border-t pt-4">
            <h2 className="text-sm font-semibold mb-3 text-gray-600">
              Variants
            </h2>

            <div className="space-y-2">
              {variants.map((v: any) => (
                <div
                  key={v.id}
                  className="border p-3 rounded text-sm"
                >
                  {Object.entries(v as Record<string, any>).map(([k, val]) => (
                    val &&
                    !hiddenFields.variant.includes(k) && (
                      <div key={k} className="flex justify-between">
                        <span className="text-gray-400">
                          {k.replace(/_/g, " ")}
                        </span>
                        <span>{String(val)}</span>
                      </div>
                    )
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}