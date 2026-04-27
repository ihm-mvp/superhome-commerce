import Link from "next/link"
import { supabase } from "@/lib/supabase"

export default async function HomePage() {

  // ===== Layouts（主）=====
  const { data: layouts } = await supabase
    .from("layouts")
    .select("*")
    .limit(3)

  // ===== Packages（真实数据）=====
  const { data: packages } = await supabase
    .from("packages")
    .select(`
      id,
      name,
      slug,
      display_price,
      layout:layouts(slug)
    `)
    .limit(3)

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-20">

      {/* ===== HERO（重构）===== */}
      <div className="relative rounded-xl overflow-hidden">

        <img
          src="/images/hero-image.png"
          className="w-full h-[480px] object-cover"
        />

        <div className="absolute inset-0 bg-black/30" />

        <div className="absolute inset-0 flex items-center">
          <div className="px-10 max-w-lg text-white space-y-5">

            <h1 className="text-4xl font-semibold leading-tight">
              Real Homes.<br />
              Move in Ready.
            </h1>

            <p className="text-white/80">
              Explore New Zealand home layouts and complete furniture packages — ready before you move in.
            </p >

            <div className="flex gap-4">
              <Link
                href="/layouts"
                className="px-5 py-3 bg-white text-black rounded-lg text-sm"
              >
                Browse Layouts
              </Link>

              <Link
                href="/packages"
                className="px-5 py-3 border border-white text-white rounded-lg text-sm"
              >
                View Packages
              </Link>
            </div>

          </div>
        </div>

      </div>

      {/* ===== TRUST BAR ===== */}
      <div className="grid md:grid-cols-4 gap-6 text-center text-sm text-gray-600">

        <div>
          <div className="font-medium">Real NZ Homes</div>
          <div className="text-xs text-gray-400">Trusted layouts</div>
        </div>

        <div>
          <div className="font-medium">Complete Packages</div>
          <div className="text-xs text-gray-400">Furniture included</div>
        </div>

        <div>
          <div className="font-medium">Transparent Pricing</div>
          <div className="text-xs text-gray-400">From day one</div>
        </div>

        <div>
          <div className="font-medium">Move in Ready</div>
          <div className="text-xs text-gray-400">No extra work</div>
        </div>

      </div>

      {/* ===== LAYOUT（核心70%）===== */}
      <div className="space-y-6">

        <div className="flex justify-between items-end">
          <h2 className="text-2xl font-semibold">
            Home Layouts
          </h2>

          <Link href="/layouts" className="text-sm text-gray-500">
            View All →
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {layouts?.map((layout: any) => (
            <Link
              key={layout.id}
              href={`/layouts/${layout.slug}`}
              className="group border rounded-xl overflow-hidden hover:shadow-lg transition"
            >

              <div className="h-52 bg-gray-100 overflow-hidden">
                <img
                  src={layout.elevation_image}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
              </div>

              <div className="p-4 space-y-3">

                <div>
                  <h3 className="font-semibold">
                    {layout.name}
                  </h3>
                  <div className="text-sm text-gray-400">
                    {layout.location}
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  {layout.bedrooms} Bed · {layout.bathrooms} Bath · {layout.garage} Garage
                </div>

              </div>

            </Link>
          ))}

        </div>

      </div>

      {/* ===== PACKAGE（升级为真实案例）===== */}

                <div className="space-y-6">

        <div className="flex justify-between items-end">
          <h2 className="text-2xl font-semibold">
            Furniture Packages
          </h2>

          <Link href="/packages" className="text-sm text-gray-500">
            View All →
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">

          {packages?.map((pkg: any) => (
            <Link
              key={pkg.id}
              href={`/packages/${pkg.slug}`}
              className="border rounded-xl overflow-hidden hover:shadow-lg transition"
            >

              <div className="h-40 bg-gray-100">
                <img
                  src={`/packages/${pkg.layout.slug}_${pkg.name.toLowerCase()}_overview.jpg`}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4 space-y-2">

                <div className="font-medium">
                  {pkg.name} Package
                </div>

                {pkg.display_price && (
                  <div className="text-sm text-gray-500">
                    ${pkg.display_price}+
                  </div>
                )}

                <div className="text-sm">
                  View →
                </div>

              </div>

            </Link>
          ))}

        </div>

      </div>

      {/* ===== PRODUCT（10%）===== */}
      <div className="border-t pt-10 flex justify-between items-center">

        <div>
          <h2 className="text-xl font-semibold">
            Browse Furniture
          </h2>

          <p className="text-sm text-gray-500">
            Explore individual products from our curated collection.
          </p >
        </div>

        <Link
          href="/products"
          className="px-4 py-2 border rounded-lg text-sm"
        >
          View Products →
        </Link>

      </div>

    </div>
  )
}