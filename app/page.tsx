import Link from "next/link"
import { supabase } from "@/lib/supabase"

export const metadata = {
  title:
    "MoveInReady | Home Products & Move-In Solutions NZ",

  description:
    "Make your home MoveInReady. Explore real NZ home layouts, complete furniture packages and individual home products for better everyday living.",

  keywords: [
    "MoveInReady",
    "move in ready solutions NZ",
    "New Zealand home products",
    "New Zealand furniture packages",
    "Christchurch showhome",
    "Christchurch furniture",
    "home furniture NZ",
    "smart home products NZ",
    "Better Life home products",
    "real NZ home layouts",
    "turn key furnishing",
  ],

  openGraph: {
    title:
      "MoveInReady | Home Products & Move-In Solutions NZ",

    description:
      "Explore real NZ home layouts, complete home furnishing solutions and individual home products for better living.",

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
      layout:layouts!packages_layout_id_fkey(
  slug
)
    `)
    .order("sort_order", { ascending: true })
    .limit(3)

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-20">

      {/* ===== HERO ===== */}
      <div className="relative rounded-2xl overflow-hidden">

        <img
          src="/images/hero-image.jpg"
          className="w-full h-[520px] object-cover"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-black/35" />

        <div className="absolute inset-0 flex items-center">

          <div className="px-10 max-w-2xl text-white space-y-6">

            <div className="space-y-3">

<div className="uppercase tracking-[0.2em] text-xs text-white/70">
  MOVEINREADY · HOME PRODUCTS & SOLUTIONS
</div>

<h1 className="text-4xl md:text-5xl font-semibold leading-tight">
  Make Your Home<br />
  MoveInReady.
</h1>

            </div>

<p className="text-white/80 text-lg leading-relaxed max-w-xl">
  From complete home furnishing packages tailored to
  real New Zealand layouts, to individual home products
  that make everyday living better.
  Discover a smarter way to make your home MoveInReady.
</p >

<div className="flex flex-wrap gap-4">

  <Link
    href="/layouts"
    className="px-5 py-3 bg-white text-black rounded-lg text-sm font-medium"
    prefetch={false}
  >
    Explore Home Layouts
  </Link>

  <Link
    href="/packages"
    className="px-5 py-3 border border-white text-white rounded-lg text-sm font-medium"
    prefetch={false}
  >
    View Packages
  </Link>

  <Link
    href="/products"
    className="px-5 py-3 border border-white/70 text-white rounded-lg text-sm font-medium hover:bg-white/10 transition"
    prefetch={false}
  >
    Shop Home Products
  </Link>

</div>

          </div>

        </div>

      </div>

      {/* ===== TRUST BAR ===== */}
{/* ===== TRUST BAR ===== */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-sm text-gray-600">

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
      Home Products
    </div>
    <div className="text-xs text-gray-400">
      Furniture, smart home and more
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
              Available Home Layouts
            </h2>

            <div className="text-sm text-gray-400">
              Approved New Zealand showhome projects
            </div>

          </div>

          <Link
            href="/layouts"
            className="text-sm text-gray-500"
            prefetch={false}
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
                  loading="lazy"
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
  Complete Home Packages
</h2>

<div className="text-sm text-gray-400">
  Furniture packages designed around real home layouts
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

{packages?.map((pkg: any) => {

  const layout = Array.isArray(pkg.layout)
    ? pkg.layout[0]
    : pkg.layout

  if (!layout) return null

  return (
    <Link
      key={pkg.id}
      href={`/packages/${pkg.slug}`}
      className="border rounded-2xl overflow-hidden hover:shadow-lg transition bg-white"
      prefetch={false}
    >

      <div className="h-44 bg-gray-100 overflow-hidden">

        <img
          src={`/packages/${layout.slug}_${pkg.name.toLowerCase()}_overview.jpg`}
          className="w-full h-full object-cover hover:scale-[1.02] transition"
          loading="lazy"
        />

      </div>

      <div className="p-5 space-y-3">

        <div className="space-y-1">

          <div className="text-lg font-semibold">
            {layout.slug.toUpperCase()} · {pkg.name}
          </div>

<div className="text-sm text-gray-400">
  Complete home furnishing solution
</div>

        </div>

        {pkg.display_price && (
          <div className="text-sm text-gray-600">
            Fully furnished from ${pkg.display_price}
          </div>
        )}

        <div className="pt-1 text-sm font-medium">
          View Package →
        </div>

      </div>

    </Link>
  )
})}

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
  MoveInReady helps you prepare your home for living.
  Explore real home layouts and complete furnishing
  packages, or shop individual products to improve
  your home and everyday lifestyle.
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
<div className="border-t pt-12 space-y-6">

  <div className="flex justify-between items-end">

    <div className="space-y-1">

      <h2 className="text-2xl font-semibold">
        Explore Home Products
      </h2>

      <p className="text-sm text-gray-500">
        More ways to make your home MoveInReady.
      </p >

    </div>

    <Link
      href="/products"
      className="text-sm text-gray-500"
      prefetch={false}
    >
      Shop All Products →
    </Link>

  </div>

  <div className="grid md:grid-cols-2 gap-6">

    <Link
      href="/products"
      className="group border rounded-2xl overflow-hidden hover:shadow-lg transition bg-white"
      prefetch={false}
    >

      <div className="h-48 bg-gray-100 overflow-hidden">

        <img
          src="/images/furniture-products.png"
          className="w-full h-full object-cover group-hover:scale-105 transition"
          loading="lazy"
        />

      </div>

      <div className="p-5 space-y-2">

        <h3 className="text-xl font-semibold">
          Furniture
        </h3>

        <p className="text-sm text-gray-500">
          Discover individual furniture pieces for
          comfortable and stylish living.
        </p >

        <div className="pt-1 text-sm font-medium">
          Shop Furniture →
        </div>

      </div>

    </Link>

    <Link
      href="/products"
      className="group border rounded-2xl overflow-hidden hover:shadow-lg transition bg-white"
      prefetch={false}
    >

      <div className="h-48 bg-gray-100 overflow-hidden">

        <img
          src="/images/better-life.png"
          className="w-full h-full object-cover group-hover:scale-105 transition"
          loading="lazy"
        />

      </div>

      <div className="p-5 space-y-2">

        <h3 className="text-xl font-semibold">
          Better Life
        </h3>

        <p className="text-sm text-gray-500">
          Discover smart home products and practical
          innovations for better everyday living.
        </p >

        <div className="pt-1 text-sm font-medium">
          Explore Better Life →
        </div>

      </div>

    </Link>

  </div>

</div>

      {/* ===== SEO CONTENT ===== */}
      <div className="border-t pt-12">

        <div className="max-w-4xl space-y-4 text-gray-600 leading-relaxed">

<h2 className="text-2xl font-semibold text-black">
  MoveInReady – Home Products & Move-In Solutions in New Zealand
</h2>

<p>
  MoveInReady brings together complete home furnishing
  solutions and individual home products to help make
  your home ready for living. Explore real New Zealand
  home layouts, Christchurch showhome projects and
  furniture packages designed around modern homes.
</p >

<p>
  Whether you are furnishing an entire home or looking
  for individual furniture and smart home products,
  MoveInReady makes it easier to create a comfortable,
  functional and enjoyable living space.
</p >

        </div>

      </div>

    </div>
  )
}