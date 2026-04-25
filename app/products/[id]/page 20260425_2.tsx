import { supabase } from "@/lib/supabase"

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  // ✅ 1️⃣ 查询产品（不带 images）
  const { data: product, error: productError } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(name)
    `)
    .eq("id", id)
    .single()

  console.log("product =", product)
  console.log("productError =", productError)

  if (!product) {
    return <div className="p-10">Not found</div>
  }

  // ✅ 2️⃣ 查询图片（关键）
  const { data: images, error: imageError } = await supabase
    .from("product_images")
    .select("image_url, sort_order")
    .eq("product_id", id)

  console.log("images =", images)
  console.log("imageError =", imageError)

  // ✅ 3️⃣ 排序（防御写法）
  const sortedImages = (images || []).sort(
    (a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0)
  )

  // ✅ 4️⃣ 主图兜底（非常关键）
  const mainImage =
    sortedImages.length > 0
      ? sortedImages[0].image_url
      : product.image_url

  return (
    <div className="max-w-6xl mx-auto p-8 grid md:grid-cols-2 gap-10">

      {/* 左侧图片 */}
      <div>

        {/* 主图 */}
        <div className="bg-gray-100 rounded-xl flex items-center justify-center p-6">
          <img
            src={mainImage}
            className="max-h-[400px] object-contain"
          />
        </div>

        {/* 缩略图（有才显示） */}
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
      <div className="space-y-4">

        <div className="text-sm text-gray-400 uppercase">
          {product.category?.[0]?.name}
        </div>

        <h1 className="text-2xl font-semibold">
          {product.sku_code}
        </h1>

        <div className="text-gray-500 text-sm whitespace-pre-line">
          {product.description}
        </div>

      </div>

    </div>
  )
}