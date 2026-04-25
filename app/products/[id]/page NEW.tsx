import { supabase } from "@/lib/supabase"

export default async function ProductPage({
  params,
}: {
  params: { id: string }
}) {
  const id = params.id   // ✅ 正确

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

  const displayFields =
    product && typeof product === "object"
      ? Object.entries(product).filter(
          ([key, value]) =>
            !["id", "image_url", "created_at", "category"].includes(key) &&
            value !== null &&
            value !== ""
        )
      : []

  return (
    <div className="max-w-6xl mx-auto p-8 grid md:grid-cols-2 gap-10">

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

      <div className="space-y-6">
        <div>
          <div className="text-sm text-gray-400 uppercase">
            {product.category?.[0]?.name}
          </div>

          <h1 className="text-3xl font-semibold mt-1">
            {product.sku_code}
          </h1>

          {product.name && (
            <div className="text-gray-500 text-sm mt-1">
              {product.name}
            </div>
          )}
        </div>

        {product.description && (
          <div className="text-gray-600 whitespace-pre-line text-sm border-t pt-4">
            {product.description}
          </div>
        )}

        <div className="border-t pt-4">
          <h2 className="text-sm font-semibold mb-3 text-gray-600">
            Product Details
          </h2>

          <div className="space-y-2">
            {displayFields.map(([key, value]) => (
              <div key={key} className="flex justify-between text-sm border-b pb-1">
                <span className="text-gray-500 capitalize">
                  {key.replace(/_/g, " ")}
                </span>
                <span className="text-gray-800 text-right max-w-[60%]">
                  {String(value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}