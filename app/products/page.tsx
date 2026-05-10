import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export const metadata = {
  title:
    'Furniture Collection NZ | Modern Home Furniture | MoveInReady',

  description:
    'Browse curated furniture collections designed for modern New Zealand homes. Explore sofas, dining tables, beds and more matched to real home layouts.',

  keywords: [
    'furniture NZ',
    'modern furniture NZ',
    'home furniture collection',
    'living room furniture',
    'bedroom furniture NZ',
    'dining furniture NZ',
    'move in ready furniture',
    'Christchurch furniture',
  ],

  openGraph: {
    title:
      'Furniture Collection | MoveInReady',

    description:
      'Curated furniture designed for modern New Zealand homes.',

    images: [
      '/images/hero-image.jpg',
    ],
  },
}

export default async function Page() {

  // ✅ 仅增加 limit，其他逻辑完全不动
  const { data: products } = await supabase
    .from('products')
    .select(`
      id,
      sku_code,
      level,
      image_url,
      categories (
        name,
        display_name,
        slug,
        sort_order
      )
    `)
    .limit(120)

  // ===== 分组 =====
  const grouped: Record<string, any[]> = {}
  const categoryMeta: Record<string, any> = {}

  products?.forEach((p: any) => {
    const cat = p.categories
    if (!cat) return

    const key = cat.slug

    if (!grouped[key]) {
      grouped[key] = []
      categoryMeta[key] = cat
    }

    grouped[key].push(p)
  })

  // ===== 产品排序（level + sku）=====
  const sortProducts = (arr: any[]) => {
    return arr.sort((a, b) => {
      const levelA = Number(a.level?.replace('L', '') || 99)
      const levelB = Number(b.level?.replace('L', '') || 99)

      if (levelA !== levelB) return levelA - levelB

      return a.sku_code.localeCompare(b.sku_code)
    })
  }

  // ===== 分类排序（sort_order）=====
  const categories = Object.keys(grouped).sort((a, b) => {
    return (categoryMeta[a].sort_order || 99) - (categoryMeta[b].sort_order || 99)
  })

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">

      {/* ===== HERO ===== */}
      <div className="max-w-xl">
        <h1 className="text-3xl font-semibold">
          Furniture Collection
        </h1>

        <p className="text-gray-500 mt-2">
          Curated furniture designed for real home layouts and complete your living spaces.
        </p >

        {/* ===== 分类导航（新增）===== */}
        <div className="flex flex-wrap gap-3 mt-6">
          {categories.map((slug) => {
            const meta = categoryMeta[slug]

            return (
              <a
                key={slug}
                href={`#${slug}`}
                className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100 transition"
              >
                {meta.display_name}
              </a >
            )
          })}
        </div>
      </div>

      {/* ===== CATEGORY PREVIEW ===== */}
      <div className="space-y-12">

        {categories.map((slug) => {
          const meta = categoryMeta[slug]
          const sorted = sortProducts(grouped[slug])
          const preview = sorted.slice(0, 4)

          return (
            <div key={slug} id={slug} className="space-y-4">

              {/* 分类标题 */}
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  {meta.display_name}
                </h2>

                <Link
                  href={`/products/category/${meta.slug}`}
                  className="text-sm text-gray-500"
                >
                  View all →
                </Link>
              </div>

              {/* 产品预览 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

                {preview.map((p) => (
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
          )
        })}

      </div>

      {/* ===== SEO Content ===== */}
      <div className="border-t pt-10">

        <div className="max-w-4xl space-y-4 text-gray-600 leading-relaxed">

          <h2 className="text-2xl font-semibold text-black">
            Modern Furniture Collections in New Zealand
          </h2>

          <p>
            MoveInReady curates furniture collections designed
            for real New Zealand home layouts. Explore sofas,
            dining furniture, beds and storage solutions matched
            to modern homes and move-in ready living.
          </p >

          <p>
            Our furniture collections help homeowners visualise,
            compare and select furniture more efficiently across
            living, dining and bedroom spaces.
          </p >

        </div>

      </div>

    </div>
  )
}