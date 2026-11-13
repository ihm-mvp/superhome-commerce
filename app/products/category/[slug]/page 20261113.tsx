import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { notFound } from "next/navigation"

type Props = {
  params: Promise<{ slug: string }>
}

// ===== SEO Metadata =====
export async function generateMetadata({ params }: Props) {
  const { slug } = await params

  const { data: category } = await supabase
    .from("categories")
    .select("display_name, slug")
    .eq("slug", slug)
    .single()

  if (!category) {
    return {
      title: "Furniture Collection | MoveInReady",
    }
  }

  const title = `${category.display_name} Furniture NZ | MoveInReady`

  const description = `Browse curated ${category.display_name.toLowerCase()} furniture collections designed for modern New Zealand homes. Discover move-in-ready furniture matched to real layouts and townhouse living.`

  return {
    title,
    description,

    keywords: [
      `${category.display_name} furniture NZ`,
      `${category.display_name} collection`,
      `modern ${category.display_name.toLowerCase()}`,
      `Christchurch furniture`,
      `move in ready furniture`,
      `townhouse furniture NZ`,
      `New Zealand furniture`,
    ],

    openGraph: {
      title,
      description,
      images: [
        "/images/hero-image.jpg",
      ],
    },
  }
}

export default async function CategoryPage({
  params,
}: Props) {

  const { slug } = await params

  // ===== 找分类 =====
  const { data: category } = await supabase
    .from("categories")
    .select("id, display_name, slug")
    .eq("slug", slug)
    .single()

  if (!category) {
    return notFound()
  }

  // ===== 查产品 =====
  const { data: products } = await supabase
    .from("products")
    .select(`
      id,
      sku_code,
      display_name_en,
      level,
      image_url
    `)
    .eq("category_id", category.id)
    .limit(24)

  // ===== 排序 =====
  const sortedProducts = (products || []).sort((a: any, b: any) => {

    const levelA = Number(a.level?.replace("L", "") || 99)
    const levelB = Number(b.level?.replace("L", "") || 99)

    if (levelA !== levelB) {
      return levelA - levelB
    }

    return a.sku_code.localeCompare(b.sku_code)
  })

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">

      {/* ===== Header ===== */}
      <div className="space-y-3">

        <h1 className="text-3xl font-semibold">
          {category.display_name}
        </h1>

        <p className="text-gray-500 max-w-3xl">
          Explore curated {category.display_name.toLowerCase()} furniture
          designed for modern New Zealand homes, townhouses and
          move-in-ready living spaces.
        </p >

      </div>

      {/* ===== Product Grid ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

        {sortedProducts.map((p: any) => (
          <Link
            key={p.id}
            href={`/products/${p.id}`}
            className="block bg-white rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 overflow-hidden"
            prefetch={false}
          >

            <div className="h-48 flex items-center justify-center bg-gray-100">
              <img
                src={p.image_url}
                className="max-h-full max-w-full object-contain p-4"
                loading="lazy"
                alt={p.display_name_en || p.sku_code}
              />
            </div>

            <div className="p-3">

              <div className="text-sm font-medium line-clamp-2">
                {p.display_name_en || p.sku_code}
              </div>

              <div className="text-xs text-gray-400 mt-1">
                {p.sku_code}
              </div>

            </div>

          </Link>
        ))}

      </div>

      {/* ===== Empty State ===== */}
      {sortedProducts.length === 0 && (
        <div className="text-gray-400 text-sm">
          No products found in this category.
        </div>
      )}

      {/* ===== SEO Content ===== */}
      <div className="border-t pt-10">

        <div className="max-w-4xl space-y-4 text-gray-600 leading-relaxed">

          <h2 className="text-2xl font-semibold text-black">
            {category.display_name} Furniture for Modern NZ Homes
          </h2>

          <p>
            MoveInReady curates {category.display_name.toLowerCase()} furniture
            collections designed for real New Zealand layouts and
            townhouse living. Every product is selected to improve
            comfort, functionality and move-in-ready living quality.
          </p >

          <p>
            Explore furniture solutions suitable for Christchurch homes,
            compact living spaces and modern residential developments.
          </p >

        </div>

      </div>

    </div>
  )
}