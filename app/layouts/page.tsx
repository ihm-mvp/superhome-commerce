import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default async function LayoutsPage() {

  // ===== layouts =====
  const { data: layouts, error } = await supabase
    .from("layouts")
    .select("*")

  if (error) {
    return <div className="p-10 text-red-500">Error: {error.message}</div>
  }

  if (!layouts || layouts.length === 0) {
    return <div className="p-10 text-gray-400">No layouts found</div>
  }

  // ===== 获取每个layout最低package价格 =====
  const { data: packages } = await supabase
    .from("packages")
    .select("layout_id, display_price")

  const priceMap: Record<string, number> = {}

  packages?.forEach((p: any) => {
    if (!p.display_price) return

    if (!priceMap[p.layout_id]) {
      priceMap[p.layout_id] = p.display_price
    } else {
      priceMap[p.layout_id] = Math.min(
        priceMap[p.layout_id],
        p.display_price
      )
    }
  })

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">

      {/* ===== HERO（升级）===== */}
      <div className="grid md:grid-cols-2 gap-10 items-center">

        <div className="space-y-6">
          <h1 className="text-4xl font-semibold leading-tight">
            Find Your Home <br />
            Fully Furnished
          </h1>

          <p className="text-gray-500 max-w-md">
            Browse real New Zealand home layouts and instantly match them with complete furniture packages.
          </p >

          <Link
            href="#grid"
            className="inline-block px-5 py-3 bg-black text-white rounded-lg text-sm"
          >
            Explore Layouts
          </Link>
        </div>

        {/* 👉 可替换为你后面生成的整图 */}
        <div className="bg-gray-100 rounded-xl h-72 flex items-center justify-center text-gray-400">
          Hero Image
        </div>

      </div>

      {/* ===== GRID ===== */}
      <div id="grid" className="space-y-6">

        <div className="flex justify-between items-end">
          <h2 className="text-2xl font-semibold">
            Available Layouts
          </h2>

          <div className="text-sm text-gray-400">
            Designed for real living
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {layouts.map((layout: any) => {
            const minPrice = priceMap[layout.id]

            return (
              <Link
                key={layout.id}
                href={`/layouts/${layout.slug}`}
                className="group border rounded-xl overflow-hidden hover:shadow-lg transition"
              >

                {/* 图片 */}
                <div className="bg-gray-100 h-56 overflow-hidden">
                  <img
                    src={layout.elevation_image}
                    className="object-cover w-full h-full group-hover:scale-105 transition"
                  />
                </div>

                {/* 内容 */}
                <div className="p-4 space-y-3">

                  {/* 标题 */}
                  <div>
                    <h2 className="text-lg font-semibold">
                      {layout.name}
                    </h2>

                    <div className="text-sm text-gray-400">
                      {layout.location}
                    </div>
                  </div>

                  {/* 规格 */}
                  <div className="text-sm text-gray-600">
                    {layout.bedrooms} Bed · {layout.bathrooms} Bath · {layout.garage} Garage
                  </div>

                  {/* 面积 */}
                  {layout.land_size && (
                    <div className="text-xs text-gray-400">
                      {layout.land_size}
                    </div>
                  )}

                  {/* 🔥 价格锚点（关键） */}
                  {minPrice && (
                    <div className="text-sm font-medium text-black">
                      Fully furnished from ${minPrice}+
                    </div>
                  )}

                  {/* CTA */}
                  <div className="pt-2 text-sm font-medium text-black">
                    View Layout →
                  </div>

                </div>
              </Link>
            )
          })}

        </div>

      </div>

    </div>
  )
}