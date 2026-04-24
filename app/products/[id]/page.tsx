import { supabase } from "@/lib/supabase"

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params   // 👈 关键修复

  const { data } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(name)
    `)
    .eq("id", id)
    .single()

  if (!data) {
    return <div className="p-10">Not found</div>
  }

  return (
    <div className="max-w-6xl mx-auto p-8 grid md:grid-cols-2 gap-10">

      <div className="bg-gray-100 rounded-xl flex items-center justify-center p-6">
        <img
          src={data.image_url}
          className="max-h-[400px] object-contain"
        />
      </div>

      <div className="space-y-4">

        <div className="text-sm text-gray-400 uppercase">
          {data.category?.name}
        </div>

        <h1 className="text-2xl font-semibold">
          {data.sku_code}
        </h1>

      </div>
    </div>
  )
}