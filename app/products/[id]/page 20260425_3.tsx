import { supabase } from "@/lib/supabase"

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  // ✅ 产品
  const { data: product } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(name)
    `)
    .eq("id", id)
    .single()

  if (!product) {
    return <div className="p-10">Not found</div>
  }

  // ✅ 图片
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

  // ✅ various（通用查法，不假设字段）
  const { data: various } = await supabase
    .from("various")
    .select("*")
    .eq("product_id", id)

  return (
    <div className="max-w-6xl mx-auto p-8 grid md:grid-cols-2 gap-10">

      {/* 左侧图片 */}
      <div>
        <div className="bg-gray-100 rounded-xl flex items-center justify-center p-6">
          <img
            src={mainImage}
            className="max-h-[400px] object-contain"
          />
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

      {/* 右侧信息 */}
      <div className="space-y-6">

        {/* 基础信息 */}
        <div>
          <div className="text-sm text-gray-400 uppercase">
            {product.category?.[0]?.name}
          </div>

          <h1 className="text-2xl font-semibold">
            {product.sku_code}
          </h1>
        </div>

        {/* 描述 */}
        {product.description && (
          <div className="text-gray-600 whitespace-pre-line text-sm">
            {product.description}
          </div>
        )}

        {/* ===== 产品所有字段（调试用，关键）===== */}
        <div className="border-t pt-4">
          <h2 className="text-sm font-semibold mb-2">
            Product Raw Data
          </h2>

          <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto">
            {JSON.stringify(product, null, 2)}
          </pre>
        </div>

        {/* ===== various 表（如果有）===== */}
        {various && various.length > 0 && (
          <div className="border-t pt-4">
            <h2 className="text-sm font-semibold mb-2">
              Various Data
            </h2>

            <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto">
              {JSON.stringify(various, null, 2)}
            </pre>
          </div>
        )}

      </div>
    </div>
  )
}