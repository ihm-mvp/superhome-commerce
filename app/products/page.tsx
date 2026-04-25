import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default async function Page() {
  const { data: products } = await supabase
    .from('products')
    .select(`
      id,
      sku_code,
      image_url,
      categories (
        name
      )
    `)

  // ===== 分组（稳定版）=====
  const grouped: Record<string, any[]> = {}

  products?.forEach((p: any) => {
    const cat = p.categories?.name || 'Other'

    if (!grouped[cat]) {
      grouped[cat] = []
    }

    grouped[cat].push(p)
  })

  const categories = Object.keys(grouped)

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">

      {/* ===== HERO ===== */}
      <div className="max-w-xl">
        <h1 className="text-3xl font-semibold">
          Furniture Collection
        </h1>

        <p className="text-gray-500 mt-2">
          Curated furniture designed to fit real home layouts and complete your living spaces.
        </p >
      </div>

      {/* ===== CATEGORY NAV ===== */}
      <div className="flex flex-wrap gap-3">
        {categories.map((cat) => (
          <a
            key={cat}
            href= "px-4 py-2 text-sm border rounded-lg hover:bg-gray-100"
          >
            {cat}
          </a >
        ))}
      </div>

      {/* ===== CATEGORY SECTIONS ===== */}
      <div className="space-y-12">

        {categories.map((cat) => (
          <div key={cat} id={cat} className="space-y-4">

            <h2 className="text-xl font-semibold">
              {cat}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

              {grouped[cat].map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.id}`}
                  className="block bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
                >

                  <div className="h-48 flex items-center justify-center bg-gray-100">
                    <img
                      src={p.image_url}
                      className="max-h-full object-contain"
                    />
                  </div>

                  <div className="p-3">
                    <div className="text-sm font-medium">
                      {p.sku_code}
                    </div>
                  </div>

                </Link>
              ))}

            </div>

          </div>
        ))}

      </div>
    </div>
  )
}