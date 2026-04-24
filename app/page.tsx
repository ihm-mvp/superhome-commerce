import { supabase } from '@/lib/supabase'

export default async function Page() {
  const { data: products } = await supabase
    .from('products')
    .select(`
      id,
      sku_code,
      image_url,
      category:categories(name)
    `)


  return (
    <div className="max-w-6xl mx-auto p-6">

      <h1 className="text-2xl font-semibold mb-6">
        SuperHome Products
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
{products?.map((p) => {
  console.log(`/products/${p.id}`)   // 👈 加在这里

  return (
    <a
      key={p.id}
      href={`/products/${p.id}`}
      className= "block bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
    >
      <div className="h-48 flex items-center justify-center bg-gray-100">
        <img
          src={p.image_url}
          className="max-h-full object-contain"
        />
      </div>

      <div className="p-3">
        <div className="text-xs text-gray-400">
          {p.category?.name}
        </div>

        <div className="text-sm font-medium">
          {p.sku_code}
        </div>
      </div>
    </a >
  )
})}
      </div>
    </div>
  )
}