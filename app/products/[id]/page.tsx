import { supabase } from "@/lib/supabase"

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const { data } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(name),
      images:product_images(image_url, sort_order)
    `)
    .eq("id", id)
    .single()

console.log("data =", data)
    console.log("images =", data?.images)

  if (!data) {
    return <div className="p-10">Not found</div>
  }
  
  // 👉 排序（核心）
  const images = (data.images || []).sort(
    (a:any, b:any) => a.sort_order - b.sort_order
  )

  return (
    <div className="max-w-6xl mx-auto p-8 grid md:grid-cols-2 gap-10">

      {/* 左侧：主图 + 缩略图 */}
      <div>

        {/* 主图（默认第一张） */}
        <div className="bg-gray-100 rounded-xl flex items-center justify-center p-6">
          <img
            src={images[0]?.image_url}
            className="max-h-[400px] object-contain"
          />
        </div>

        {/* 缩略图列表 */}
        <div className="flex gap-3 mt-4 flex-wrap">
          {images.map((img:any) => (
            <img
              key={img.image_url}
              src={img.image_url}
              className="w-16 h-16 object-contain border rounded-md"
            />
          ))}
        </div>

      </div>

      {/* 右侧：产品信息 */}
      <div className="space-y-4">

        <div className="text-sm text-gray-400 uppercase">
          {data.category?.[0]?.name}
        </div>

        <h1 className="text-2xl font-semibold">
          {data.sku_code}
        </h1>

      </div>

    </div>
  )
}