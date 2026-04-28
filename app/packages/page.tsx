import Link from "next/link"
import { supabase } from "@/lib/supabase"

export default async function PackagesPage() {

  // ===== 获取所有 packages + layout =====
  const { data: packages } = await supabase
    .from("packages")
    .select(`
      id,
      name,
      slug,
      display_price,
      sort_order,
      layout_id,
      layout:layouts(
        id,
        name,
        slug
      )
    `)
    .order("sort_order", { ascending: true })

  // ===== 按 layout 分组 =====
  const grouped: Record<string, any> = {}

  packages?.forEach((pkg: any) => {
    const key = pkg.layout.id

    if (!grouped[key]) {
      grouped[key] = {
        layout: pkg.layout,
        packages: []
      }
    }

    grouped[key].packages.push(pkg)
  })

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">

      {/* ===== Hero ===== */}
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold">
          Furniture Packages
        </h1>
        <p className="text-gray-500">
          Choose a complete furniture solution tailored to your home layout.
        </p >
      </div>

      {/* ===== Layout 分组 ===== */}
      <div className="space-y-10">

        {Object.values(grouped).map((group: any) => (

          <div key={group.layout.id} className="space-y-4">

            {/* Layout 标题 */}
            <div className="flex justify-between items-end">
              <h2 className="text-xl font-semibold">
                {group.layout.name}
              </h2>

              <Link
                href={`/layouts/${group.layout.slug}`}
                className="text-sm text-gray-400"
              >
                View Layout →
              </Link>
            </div>

            {/* Packages 列表 */}
            <div className="grid md:grid-cols-3 gap-6">

              {group.packages.map((pkg: any) => (
                <Link
                  key={pkg.id}
                  href={`/packages/${pkg.slug}`}
                  className="border rounded-xl overflow-hidden hover:shadow-lg transition"
                >

                  {/* 图片 */}
                  <div className="h-40 bg-gray-100">
                    <img
                      src={`/packages/${pkg.layout.slug}_${pkg.name.toLowerCase()}_overview.jpg`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* 信息 */}
                  <div className="p-4 space-y-2">

                    <div className="font-medium">
                      {pkg.name}
                    </div>

                    {pkg.display_price && (
                      <div className="text-sm text-gray-500">
                        ${pkg.display_price}+
                      </div>
                    )}

                    <div className="text-sm text-gray-400">
                      View →
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