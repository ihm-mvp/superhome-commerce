import Link from "next/link"
import { supabase } from "@/lib/supabase"

export const metadata = {
  title:
    "Furniture Packages NZ | Move-In Ready Home Packages | MoveInReady",

  description:
    "Explore complete furniture packages designed for real New Zealand home layouts. Move-in ready furniture solutions for modern homes in Christchurch and across New Zealand.",

  keywords: [
    "furniture packages NZ",
    "move in ready furniture",
    "new home furniture package",
    "fully furnished home NZ",
    "Christchurch furniture package",
    "New Zealand furniture package",
    "home furnishing packages",
    "modern furniture NZ",
  ],

  openGraph: {
    title:
      "Furniture Packages NZ | MoveInReady",

    description:
      "Explore curated furniture packages designed for real New Zealand homes.",

    images: [
      "/layouts/layouts-hero.jpg",
    ],
  },
}

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
      layout:layouts!packages_layout_id_fkey(
        id,
        name,
        slug,
        location,
        bedrooms,
        bathrooms,
        garage,
        land_size
      )
    `)
    .order("sort_order", { ascending: true })

  // ===== 按 layout 分组 =====
  const grouped: Record<string, any> = {}

  packages?.forEach((pkg: any) => {

    // 防止 relation 异常
    if (!pkg.layout) return

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
      <div className="space-y-4 max-w-3xl">

        <div className="text-sm uppercase tracking-wide text-gray-400">
          Move-In Ready Furniture Packages
        </div>

        <h1 className="text-3xl md:text-4xl font-semibold leading-tight">
          Furniture Packages for Modern New Zealand Homes
        </h1>

        <p className="text-gray-500 leading-relaxed">
          Explore complete furniture solutions tailored to real
          New Zealand home layouts. Compare Basic, Standard and
          Premium packages designed for move-in ready living.
        </p >

      </div>

      {/* ===== Layout 分组 ===== */}
      <div className="space-y-14">

        {Object.values(grouped).map((group: any) => (

          <div
            key={group.layout.id}
            className="space-y-5"
          >

            {/* Layout 标题 */}
            <div className="flex justify-between items-end">

              <div className="space-y-2">

                <h2 className="text-2xl font-semibold">
                  {group.layout.name}
                </h2>

                {/* 地址 */}
                <div className="text-gray-400">
                  {group.layout.location}
                </div>

                {/* 房屋信息 */}
                <div className="text-sm text-gray-600">
                  {group.layout.bedrooms} Bed ·{" "}
                  {group.layout.bathrooms} Bath ·{" "}
                  {group.layout.garage} Garage
                </div>

                {/* 占地面积 */}
                {group.layout.land_size && (
                  <div className="text-sm text-gray-400">
                    {group.layout.land_size}
                  </div>
                )}

              </div>

              <Link
                href={`/layouts/${group.layout.slug}`}
                className="text-sm text-gray-400 hover:text-black transition"
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
                  className="border rounded-2xl overflow-hidden hover:shadow-lg transition bg-white"
                >

                  {/* 图片 */}
                  <div className="h-48 bg-gray-100 overflow-hidden">

                    <img
                      src={`/packages/${pkg.layout.slug}_${pkg.name.toLowerCase()}_overview.jpg`}
                      className="w-full h-full object-cover hover:scale-[1.02] transition"
                    />

                  </div>

                 {/* 信息 */}
                  <div className="p-5 space-y-3">

                    <div className="space-y-1">

                      <div className="font-medium text-lg">
                        {pkg.name}
                      </div>

                      <div className="text-sm text-gray-400">
                        {group.layout.name}
                      </div>

                    </div>

                    {pkg.display_price && (
                      <div className="text-sm text-gray-600">
                        From ${pkg.display_price} NZD
                      </div>
                    )}

                    <div className="text-sm text-gray-400">
                      View Package →
                    </div>

                  </div>

                </Link>
              ))}

            </div>

          </div>
        ))}

      </div>

      {/* ===== SEO Content ===== */}
      <div className="border-t pt-12">

        <div className="max-w-4xl space-y-4 text-gray-600 leading-relaxed">

          <h2 className="text-2xl font-semibold text-black">
            Move-In Ready Furniture Packages in New Zealand
          </h2>

          <p>
            MoveInReady provides complete furniture packages
            designed around real New Zealand home layouts.
            Each package is curated to simplify furnishing and
            help homeowners move into a fully prepared space
            faster and more efficiently.
          </p >

          <p>
            Our furniture packages combine living room,
            dining room and bedroom furniture selections into
            coordinated solutions tailored for modern
            New Zealand homes and townhouses.
          </p >

        </div>

      </div>

    </div>
  )
}