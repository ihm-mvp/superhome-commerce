
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export const metadata = {
  title:
    "Shop Home Products NZ | Furniture & Better Life | MoveInReady",

  description:
    "Discover home products at MoveInReady. Explore furniture, smart home technology and practical products designed to make everyday living better.",

  keywords: [
    "MoveInReady",
    "home products NZ",
    "furniture NZ",
    "smart home products NZ",
    "Better Life",
    "modern home products",
    "Christchurch furniture",
    "New Zealand home products",
  ],

  openGraph: {
    title:
      "Shop Home Products | MoveInReady",

    description:
      "Explore furniture, smart home products and practical solutions for better everyday living.",

    images: [
      "/images/hero-image.jpg",
    ],
  },
}

export default async function Page() {

  // ===== Load Products =====
  const { data: products } = await supabase
    .from("products")
    .select(`
      id,
      sku_code,
      level,
      image_url,
      display_name_en,
      categories (
        name,
        display_name,
        slug,
        sort_order
      )
    `)
    .limit(240)

  // ===== Group Products by Category =====
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

  // ===== Product Sorting =====
  const sortProducts = (arr: any[]) => {
    return [...arr].sort((a, b) => {
      const levelA = Number(a.level?.replace("L", "") || 99)
      const levelB = Number(b.level?.replace("L", "") || 99)

      if (levelA !== levelB) {
        return levelA - levelB
      }

      return (a.sku_code || "").localeCompare(b.sku_code || "")
    })
  }

  // ===== Category Sorting =====
  const categories = Object.keys(grouped).sort((a, b) => {
    return (
      (categoryMeta[a].sort_order || 99) -
      (categoryMeta[b].sort_order || 99)
    )
  })

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">

      {/* ===== HERO ===== */}
      <div className="max-w-3xl space-y-3">

        <h1 className="text-3xl font-semibold">
          Shop Home Products
        </h1>

        <p className="text-gray-500 leading-relaxed">
          Discover furniture, smart home products and
          practical solutions designed to make everyday
          living more comfortable, convenient and enjoyable.
        </p >

      </div>

      {/* ===== SHOP BY CATEGORY ===== */}
      <div className="space-y-6">

        <div className="space-y-1">

          <h2 className="text-2xl font-semibold">
            Shop by Category
          </h2>

          <p className="text-sm text-gray-400">
            Explore products across our home and lifestyle collections.
          </p >

        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {categories.map((slug) => {

            const meta = categoryMeta[slug]
            const sorted = sortProducts(grouped[slug])
            const representative = sorted[0]

            return (
              <Link
                key={slug}
                href={`/products/category/${slug}`}
                className="group block bg-white border rounded-2xl overflow-hidden hover:shadow-lg transition"
                prefetch={false}
              >

                <div className="aspect-square bg-gray-50 overflow-hidden flex items-center justify-center">

                  {representative?.image_url && (
                    <img
                      src={representative.image_url}
                      alt={meta.display_name}
                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition duration-300"
                      loading="lazy"
                    />
                  )}

                </div>

                <div className="p-4 space-y-2">

                  <h3 className="text-lg font-semibold">
                    {meta.display_name}
                  </h3>

                  <div className="text-xs text-gray-400">
                    {sorted.length} products
                  </div>

                  <div className="text-sm font-medium pt-1">
                    Explore Collection →
                  </div>

                </div>

              </Link>
            )
          })}

        </div>

        {categories.length === 0 && (
          <div className="text-sm text-gray-400">
            Product collections are coming soon.
          </div>
        )}

      </div>

      {/* ===== SEO CONTENT ===== */}
      <div className="border-t pt-10">

        <div className="max-w-4xl space-y-4 text-gray-600 leading-relaxed">

<h2 className="text-2xl font-semibold text-black">
            Home Products for Better Everyday Living
          </h2>

          <p>
            MoveInReady brings together individual home
            products and complete home furnishing solutions.
            Explore furniture, smart home technology and
            practical products selected to make modern
            living more comfortable and convenient.
          </p >

          <p>
            Whether you are furnishing a new home or looking
            for individual products to improve your existing
            living space, discover a simpler way to make
            your home MoveInReady.
          </p >

        </div>

      </div>

    </div>
  )
}