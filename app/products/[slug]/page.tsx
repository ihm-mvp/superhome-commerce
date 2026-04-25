import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function CategoryPage({
  params,
}: {
  params: { slug: string }
}) {
  const { slug } = params

  // ===== 取所有分类（用于导航）=====
  const { data: categories } = await supabase
    .from("categories")
    .select("name, display_name, slug, sort_order")
    .order("sort_order", { ascending: true })

  // ===== 找当前分类 =====
  const currentCategory = categories?.find((c) => c.slug === slug)

  if (!currentCategory) {
    return notFound()
  }

  // ===== 取该分类产品 =====
  const { data: products } = await supabase
    .from("products")
    .select(`
      id,
      sku_code,
      level,
      image_url,
      categories (
        slug
      )
    `)
    .eq("categories.slug", slug) // 👈 关键过滤

  // ===== 排序（level + sku）=====
  const sortedProducts = (products || []).sort((a: any, b: any) => {
    const levelA = Number(a.level?.replace("L", "") || 99)
    const levelB = Number(b.level?.replace("L", "") || 99)

    if (levelA !== levelB) return levelA - levelB

    return a.sku_code.localeCompare(b.sku_code)
  })

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">

      {/* ===== Header ===== */}
      <div>
        <h1 className="text-3xl font-semibold">
          {currentCategory.display_name}
        </h1>

        <p className="text-gray-500 mt-2">
          Browse all {currentCategory.display_name.toLowerCase()} in our collection.
        </p >
      </div>

      {/* ===== 分类导航（横向切换）===== */}
      <div className="flex flex-wrap gap-3">

        {categories?.map((cat) => (
          <Link
            key={cat.slug}
            href={`/products/${cat.slug}`}
            className={`px-4 py-2 text-sm border rounded-lg transition
              ${cat.slug === slug
                ? "bg-black text-white border-black"
                : "hover:bg-gray-100"
              }`}
          >
            {cat.display_name}
          </Link>
        ))}

      </div>

      {/* ===== 产品列表 ===== */}
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

      {/* ===== 空状态（防止空分类）===== */}
      {sortedProducts.length === 0 && (
        <div className="text-gray-400 text-sm">
          No products found in this category.
        </div>
      )}

    </div>
  )
}