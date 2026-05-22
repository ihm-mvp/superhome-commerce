import Link from "next/link"
import { supabase } from "@/lib/supabase"

export const metadata = {
  title:
    "MoveInReady | Real NZ Showhomes & Furniture Packages",

  description:
    "Explore real New Zealand home layouts, approved showhome projects and complete move-in ready furniture packages designed for modern living.",

  keywords: [
    "MoveInReady",
    "New Zealand furniture packages",
    "Christchurch showhome",
    "move in ready homes",
    "real NZ home layouts",
    "showhome furnishing",
    "modern NZ living",
    "furniture package NZ",
    "turn key furnishing",
    "home staging NZ",
  ],

  openGraph: {
    title:
      "MoveInReady | Real NZ Showhomes & Furniture Packages",

    description:
      "Discover real Christchurch showhome layouts and curated move-in ready furniture packages.",

    images: [
      "/images/hero-image.jpg",
    ],
  },
}

export default async function HomePage() {

  // ===== Layouts =====
  const { data: layouts } = await supabase
    .from("layouts")
    .select(`
      id,
      slug,
      hero_exterior_image,
      name,
      location,
      bedrooms,
      bathrooms,
      garage,
      floor_size,
      land_size
    `)
    .limit(3)

  // ===== Packages =====
  const { data: packages } = await supabase
    .from("packages")
    .select(`
      id,
      name,
      slug,
      display_price,
      sort_order,
      layout:layouts(slug)
    `)
    .order("sort_order", { ascending: true })
    .limit(3)

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-20">

      {/* ===== HERO ===== */}
      <div className="relative rounded-2xl overflow-hidden">

        <img
          src="/images/hero-image.png"
          className="w-full h-[520px] object-cover"
        />

        <div className="absolute inset-0 bg-black/35" />

        <div className="absolute inset-0 flex items-center">

          <div className="px-10 max-w-2xl text-white space-y-6">

            <div className="space-y-3">

              <div className="uppercase tracking-[0.2em] text-xs text-white/70">
                Real NZ Showhomes
              </div>

              <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
                Real Homes.<br />
                Move-In Ready.
              </h1>

            </div>

            <p className="text-white/80 text-lg leading-relaxed max-w-xl">
              Explore real New Zealand home layouts and
              complete furniture packages designed for
              modern move-in ready living.
            </p >

            <div className="flex gap-4">

              <Link
                href="/layouts"
                className="px-5 py-3 bg-white text-black rounded-lg text-sm font-medium"
                prefetch={false}
              >
                Browse Layouts
              </Link>

              <Link
                href="/packages"
                className="px-5 py-3 border border-white text-white rounded-lg text-sm"
                prefetch={false}
              >
                View Packages
              </Link>

            </div>

          </div>

        </div>

      </div>

      {/* ===== TRUST BAR ===== */}
      <div className="grid md:grid-cols-4 gap-6 text-center text-sm text-gray-600">

        <div className="space-y-1">

          <div className="font-medium">
            Real NZ Homes
          </div>

          <div className="text-xs text-gray-400">
            Approved showhome layouts
          </div>

        </div>

        <div className="space-y-1">

          <div className="font-medium">
            Complete Packages
          </div>

          <div className="text-xs text-gray-400">
            Curated furnishing solutions
          </div>

        </div>

        <div className="space-y-1">

          <div className="font-medium">
            Transparent Pricing
          </div>

          <div className="text-xs text-gray-400">
            Real package pricing
          </div>

        </div>

        <div className="space-y-1">

          <div className="font-medium">
            Move-In Ready
          </div>

          <div className="text-xs text-gray-400">
            Designed before you move in
          </div>

        </div>

      </div>

      {/* ===== LAYOUTS ===== */}
      <div className="space-y-6">

        <div className="flex justify-between items-end">

          <div className="space-y-1">

            <h2 className="text-2xl font-semibold">
              Real Home Layouts
            </h2>

            <div className="text-sm text-gray-400">
              Approved New Zealand showhome projects
            </div>

          </div>

          <Link
            href="/layouts"
            className="text-sm text-gray-500"
          >
            View All →
          </Link>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {layouts?.map((layout: any) => (
            <Link
              key={layout.id}
              href={`/layouts/${layout.slug}`}
              className="group border rounded-2xl overflow-hidden hover:shadow-lg transition bg-white"
              prefetch={false}
            >

              <div className="h-56 bg-gray-100 overflow-hidden">

                <img
                  src={layout.hero_exterior_image}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />

              </div>

              <div className="p-5 space-y-4">

                <div className="space-y-1">

                  <h3 className="text-xl font-semibold">
                    {layout.name}
                  </h3>

                  <div className="text-sm text-gray-400">
                    {layout.location}
                  </div>

                </div>

                <div className="text-sm text-gray-600 leading-relaxed">

                  {layout.bedrooms} Bed ·{" "}
                  {layout.bathrooms} Bath ·{" "}
                  {layout.garage} Garage

                  {layout.floor_size && (
                    <> · {layout.floor_size} Floor</>
                  )}

                  {layout.land_size && (
                    <> · {layout.land_size} Land</>
                  )}

                </div>

              </div>

            </Link>
          ))}

        </div>

      </div>

      {/* ===== PACKAGES ===== */}
      <div className="space-y-6">

        <div className="flex justify-between items-end">

          <div className="space-y-1">

            <h2 className="text-2xl font-semibold">
              Furniture Packages
            </h2>

            <div className="text-sm text-gray-400">
              Move-in ready furnishing concepts
            </div>

          </div>

          <Link
            href="/packages"
            className="text-sm text-gray-500"
            prefetch={false}
          >
            View All →
          </Link>

        </div>

        <div className="grid md:grid-cols-3 gap-6">

          {packages?.map((pkg: any) => (
            <Link
              key={pkg.id}
              href={`/packages/${pkg.slug}`}
              className="border rounded-2xl overflow-hidden hover:shadow-lg transition bg-white"
              prefetch={false}
            >

              <div className="h-44 bg-gray-100 overflow-hidden">

                <img
                  src={`/packages/${pkg.layout.slug}_${pkg.name.toLowerCase()}_overview.jpg`}
                  className="w-full h-full object-cover hover:scale-[1.02] transition"
                />

              </div>

              <div className="p-5 space-y-3">

                <div className="space-y-1">

                  <div className="text-lg font-semibold">
                    {pkg.layout.slug.toUpperCase()} · {pkg.name}
                  </div>

                  <div className="text-sm text-gray-400">
                    Complete furniture package
                  </div>

                </div>

                {pkg.display_price && (
                  <div className="text-sm text-gray-600">
                    From ${pkg.display_price} NZD
                  </div>
                )}

                <div className="pt-1 text-sm font-medium">
                  View Package →
                </div>

              </div>

            </Link>
          ))}

        </div>

      </div>

      {/* ===== PROCESS ===== */}
      <div className="border rounded-2xl p-8 bg-gray-50">

        <div className="space-y-8">

          <div className="space-y-2 max-w-2xl">

            <div className="text-sm uppercase tracking-wide text-gray-400">
              How MoveInReady Works
            </div>

            <h2 className="text-3xl font-semibold">
              From Layout to Move-In Ready
            </h2>

            <p className="text-gray-600 leading-relaxed">
              MoveInReady combines real home layouts,
              curated furniture packages and staging concepts
              into a complete furnishing experience for modern
              New Zealand homes.
            </p >

          </div>

          <div className="grid md:grid-cols-4 gap-6 text-sm">

            <div className="space-y-2">

              <div className="font-medium">
                1. Explore Layouts
              </div>

              <div className="text-gray-500">
                Browse real Christchurch showhome projects.
              </div>

            </div>

            <div className="space-y-2">

              <div className="font-medium">
                2. Compare Packages
              </div>

              <div className="text-gray-500">
                Review Basic, Standard and Premium furnishing concepts.
              </div>

            </div>

            <div className="space-y-2">

              <div className="font-medium">
                3. Select Furniture
              </div>

              <div className="text-gray-500">
                Explore curated products tailored to each room layout.
              </div>

            </div>

            <div className="space-y-2">

              <div className="font-medium">
                4. Move-In Ready
              </div>

              <div className="text-gray-500">
                Complete furnishing solutions designed before move-in day.
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ===== PRODUCTS ===== */}
      <div className="border-t pt-10 flex justify-between items-center">

        <div>

          <h2 className="text-xl font-semibold">
            Browse Furniture
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Explore individual furniture products from our curated collection.
          </p >

        </div>

        <Link
          href="/products"
          className="px-4 py-2 border rounded-lg text-sm"
          prefetch={false}
        >
          View Products →
        </Link>

      </div>

      {/* ===== SEO CONTENT ===== */}
      <div className="border-t pt-12">

        <div className="max-w-4xl space-y-4 text-gray-600 leading-relaxed">

          <h2 className="text-2xl font-semibold text-black">
            Real New Zealand Showhomes with Move-In Ready Furniture Packages
          </h2>

          <p>
            MoveInReady connects real New Zealand home layouts
            with curated furniture packages designed for modern
            move-in ready living. Explore Christchurch showhome
            projects, furnishing concepts and complete furniture
            solutions tailored to real homes.
          </p >

          <p>
            From layout planning to furniture selection,
            MoveInReady demonstrates how real homes can be
            transformed into fully furnished living spaces
            before homeowners move in.
          </p >

        </div>

      </div>

    </div>
  )
}