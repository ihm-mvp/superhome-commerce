import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params  // ✅ 关键修复

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
    .select("id, sku_code, level, image_url")
    .eq("category_id", category.id)

  // ===== 排序 =====
  const sortedProducts = (products || []).sort((a: any, b: any) => {
    const levelA = Number(a.level?.replace("L", "") || 99)
    const levelB = Number(b.level?.replace("L", "") || 99)

    if (levelA !== levelB) return levelA - levelB

    return a.sku_code.localeCompare(b.sku_code)
  })

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">

      <h1 className="text-3xl font-semibold">
        {category.display_name}
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

        {sortedProducts.map((p: any) => (
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

      {sortedProducts.length === 0 && (
        <div className="text-gray-400 text-sm">
          No products found in this category.
        </div>
      )}

    </div>
  )
}