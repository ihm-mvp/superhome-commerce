import { supabase } from "@/lib/supabase"
import Link from "next/link"

export const metadata = {
  title: "Home Layouts NZ | Move-in Ready Furnished Homes",
  description:
    "Explore real New Zealand home layouts and discover fully furnished furniture packages. Plan your move-in ready home with confidence.",
}

export default async function LayoutsPage() {

  const { data: layouts } = await supabase
    .from("layouts")
    .select("*")

  if (!layouts || layouts.length === 0) {
    return <div className="p-10 text-gray-400">No layouts found</div>
  }

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
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-16">

      {/* ===== HERO ===== */}
      <div className="relative rounded-xl overflow-hidden">

        <img
          src="/layouts/layouts-hero.jpg"
          className="w-full h-[420px] object-cover"
        />

        <div className="absolute inset-0 bg-black/30" />

        <div className="absolute inset-0 flex items-center">
          <div className="px-10 max-w-lg text-white space-y-4">

            <h1 className="text-4xl font-semibold leading-tight">
              Explore New Zealand <br />
              Home Layouts
            </h1>

            <p className="text-white/80">
              Browse real home layouts and discover move-in ready furniture packages designed for modern living in New Zealand.
            </p >

            <Link
              href="#grid"
              className="inline-block px-5 py-3 bg-white text-black rounded-lg text-sm"
            >
              Explore Layouts
            </Link>

          </div>
        </div>

      </div>

      {/* ===== GRID ===== */}
      <div id="grid" className="space-y-6">

        <div className="flex justify-between items-end">
          <h2 className="text-2xl font-semibold">
            Available Home Layouts
          </h2>

          <div className="text-sm text-gray-400">
            Real layouts · Designed for living
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

                <div className="bg-gray-100 h-56 overflow-hidden">
                  <img
                    src={layout.elevation_image}
                    className="object-cover w-full h-full group-hover:scale-105 transition"
                  />
                </div>

                <div className="p-4 space-y-3">

                  <div>
                    <h2 className="text-lg font-semibold">
                      {layout.name}
                    </h2>

                    <div className="text-sm text-gray-400">
                      {layout.location}
                    </div>
                  </div>

                  <div className="text-sm text-gray-600">
                    {layout.bedrooms} Bed · {layout.bathrooms} Bath · {layout.garage} Garage
                  </div>

                  {layout.land_size && (
                    <div className="text-xs text-gray-400">
                      {layout.land_size}
                    </div>
                  )}

                  {minPrice && (
                    <div className="text-sm font-medium text-black">
                      Fully furnished from ${minPrice}+
                    </div>
                  )}

                  <div className="pt-2 text-sm font-medium text-black">
                    View Layout →
                  </div>

                </div>
              </Link>
            )
          })}

        </div>

      </div>

      {/* ===== TRUST / SUPPLY SECTION ===== */}
      <div className="pt-10 border-t space-y-4 text-center">

        <div className="text-xs text-gray-400 uppercase tracking-wide">
          Supply supported by selected manufacturing partners
        </div>

        <div className="flex justify-center">
          <img
            src="/images/RoyalShow-LOGO.png"
            className="h-10 object-contain opacity-70"
          />
                    <img
            src="/images/AoshenHome-LOGO.jpg"
            className="h-10 object-contain opacity-70"
          />
        </div>
      </div>

    </div>
  )
}