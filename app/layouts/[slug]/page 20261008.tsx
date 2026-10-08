import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"
import Link from "next/link"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const { data: layout } = await supabase
    .from("layouts")
    .select(`
      name,
      slug,
      location,
      bedrooms,
      bathrooms,
      garage,
      floor_size,
      land_size,
      builder_name,
      hero_exterior_image
    `)
    .eq("slug", slug)
    .single()

  if (!layout) {
    return {
      title: "Layout Not Found | MoveInReady",
    }
  }

  return {
    title:
      `${layout.name} | Move-In Ready Showhome | MoveInReady`,

    description:
      `${layout.name} is a real Christchurch showhome project featuring move-in ready furniture packages, modern New Zealand living spaces and curated furnishing solutions.`,

    keywords: [
      `${layout.name}`,
      "Christchurch showhome",
      "New Zealand home layout",
      "move in ready furniture",
      "furniture packages NZ",
      "showhome furnishing",
      "modern NZ home",
      `${layout.location}`,
      `${layout.bedrooms} bedroom home`,
    ],

    openGraph: {
      title:
        `${layout.name} | Move-In Ready Showhome`,

      description:
        `Explore furniture packages and layout details for ${layout.name} in ${layout.location}.`,

      images: [
        layout.hero_exterior_image ||
        "/earlsbrook-hero-exterior-image.jpg",
      ],
    },
  }
}

export default async function LayoutDetail({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // ===== Layout =====
const { data: layout } = await supabase
  .from("layouts")
  .select(`
    id,
    name,
    slug,
    location,
    bedrooms,
    bathrooms,
    garage,
    floor_size,
    land_size,
    builder_name,
    description,
    hero_exterior_image,
    floorplan_image,
    floorplan_highlights
  `)
  .eq("slug", slug)
  .single()

  if (!layout) return notFound()

  // ===== Packages =====
  const { data: packages } = await supabase
    .from("packages")
    .select("id, name, slug, display_price")
    .eq("layout_id", layout.id)
    .order("sort_order", { ascending: true })

  // ===== Files =====
const { data: files } = await supabase
  .from("layout_files")
  .select(`
    id,
    name,
    file_url
  `)
  .eq("layout_id", layout.id)

  const downloads = files || []

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-16">

      {/* ===== HERO ===== */}
      <div className="space-y-6">

        {/* Exterior Hero */}
        <div className="rounded-2xl overflow-hidden border bg-gray-100">
          <img
            src={
              layout.hero_exterior_image ||
              "/earlsbrook-hero-exterior-image.jpg"
            }
            className="w-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Hero Content */}
        <div className="grid md:grid-cols-2 gap-10 items-start">

          {/* Left */}
          <div className="space-y-5">

            <div className="space-y-2">

              <div className="text-sm uppercase tracking-wide text-gray-400">
                Move-In Ready Showhome
              </div>

              <h1 className="text-4xl font-semibold leading-tight">
                {layout.name}
              </h1>

              <div className="text-gray-500">
                {layout.location}
              </div>

            </div>

            <div className="flex flex-wrap gap-3 text-sm">

              <div className="border rounded-lg px-4 py-2">
                {layout.bedrooms} Bed
              </div>

              <div className="border rounded-lg px-4 py-2">
                {layout.bathrooms} Bath
              </div>

              <div className="border rounded-lg px-4 py-2">
                {layout.garage} Garage
              </div>

              {layout.floor_size && (
                <div className="border rounded-lg px-4 py-2">
                  {layout.floor_size} Floor
                </div>
              )}

              {layout.land_size && (
                <div className="border rounded-lg px-4 py-2">
                  {layout.land_size} Land
                </div>
              )}

            </div>

            {layout.description && (
              <div className="text-gray-600 leading-relaxed max-w-2xl">
                {layout.description}
              </div>
            )}

          </div>

          {/* Right */}
          <div className="border rounded-2xl p-6 bg-gray-50 space-y-5">

            <div className="space-y-1">

              <div className="text-sm uppercase tracking-wide text-gray-400">
                Approved Building Consent
              </div>

              <div className="text-xl font-semibold">
                Real Christchurch Showhome Project
              </div>

            </div>

            <div className="space-y-3 text-sm text-gray-600">

              {layout.builder_name && (
                <div className="flex justify-between gap-4">

                  <div className="text-gray-400">
                    Builder
                  </div>

                  <div className="font-medium text-right">
                    {layout.builder_name}
                  </div>

                </div>
              )}

              <div className="flex justify-between gap-4">

                <div className="text-gray-400">
                  Location
                </div>

                <div className="font-medium text-right">
                  {layout.location}
                </div>

              </div>

              {layout.floor_size && (
                <div className="flex justify-between gap-4">

                  <div className="text-gray-400">
                    Floor Area
                  </div>

                  <div className="font-medium text-right">
                    {layout.floor_size}
                  </div>

                </div>
              )}

              {layout.land_size && (
                <div className="flex justify-between gap-4">

                  <div className="text-gray-400">
                    Land Area
                  </div>

                  <div className="font-medium text-right">
                    {layout.land_size}
                  </div>

                </div>
              )}

            </div>

            <div className="border-t pt-5 text-sm text-gray-500 leading-relaxed">
              This layout is part of a real Move-In Ready
              showhome project currently progressing through
              construction and furnishing in Christchurch,
              New Zealand.
            </div>

          </div>

        </div>

      </div>

      {/* ===== PACKAGES ===== */}
      {packages && packages.length > 0 && (
        <div className="space-y-6">

          <div className="flex justify-between items-end">

            <div className="space-y-1">

              <h2 className="text-2xl font-semibold">
                Move-in Ready Packages
              </h2>

              <div className="text-sm text-gray-400">
                Furnishing concepts demonstrated through this layout
              </div>

            </div>

          </div>

          <div className="grid md:grid-cols-3 gap-6">

            {packages.map((pkg: any) => {

              const packageType =
                pkg.name.toLowerCase()

              return (
                <Link
                  key={pkg.id}
                  href={`/packages/${pkg.slug}`}
                  className="border rounded-2xl overflow-hidden hover:shadow-lg transition bg-white"
                  prefetch={false}
                >

                  {/* Hero */}
                  <div className="bg-gray-100 h-52 overflow-hidden">

                    <img
                      src={`/packages/${slug}_${packageType}_overview.jpg`}
                      className="w-full h-full object-cover hover:scale-[1.02] transition"
                      loading="lazy"
                    />

                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-3">

                    <div className="space-y-1">

                      <div className="text-xl font-semibold">
                        {pkg.name}
                      </div>

                      <div className="text-sm text-gray-400">
                        Complete move-in ready furniture package
                      </div>

                    </div>

                    {pkg.display_price && (
                      <div className="text-sm text-gray-600">
                        Fully furnished from ${pkg.display_price}
                      </div>
                    )}

                    <div className="pt-2 text-sm font-medium">
                      View Package →
                    </div>

                  </div>

                </Link>
              )
            })}

          </div>

        </div>
      )}

      {/* ===== FLOOR PLAN ===== */}
      {layout.floorplan_image && (
        <div className="space-y-6">

          <div className="space-y-1">

            <h2 className="text-2xl font-semibold">
              Floor Plan
            </h2>

            <div className="text-sm text-gray-400">
              Approved BC floor plan reference
            </div>

          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-start">

            {/* Plan */}
            <div className="lg:col-span-2">

              <img
                src={layout.floorplan_image}
                className="rounded-2xl border"
                loading="lazy"
              />

            </div>

            {/* Highlights */}
            <div className="border rounded-2xl p-6 bg-gray-50 space-y-5">

              <div className="space-y-1">

                <div className="text-sm uppercase tracking-wide text-gray-400">
                  Spatial Highlights
                </div>

                <div className="text-xl font-semibold">
                  Designed for Modern NZ Living
                </div>

              </div>

{layout.floorplan_highlights ? (
  <div className="space-y-3 text-sm text-gray-600 leading-relaxed">

    {layout.floorplan_highlights
      .split("·")
      .map((item: string, idx: number) => {
        return (
          <div
            key={idx}
            className="flex gap-3"
          >

            <div className="mt-[7px] w-1.5 h-1.5 rounded-full bg-black shrink-0" />

            <div>
              {item.trim()}
            </div>

          </div>
        )
      })}

  </div>
) : (
  <div className="text-sm text-gray-500">
    Open-plan living and functional room
    arrangement designed for move-in ready furnishing.
  </div>
)}

            </div>

          </div>

        </div>
      )}

      {/* ===== VIDEO ===== 以后拓展*/}

      {/* ===== DOCUMENTS ===== */}
      {downloads.length > 0 && (
        <div className="space-y-4 border-t pt-8">

          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
            Documents
          </h2>

          <div className="flex flex-wrap gap-4">

            {downloads.map((doc: any) => (
              <a
                key={doc.id}
                target= "_blank"
                className="text-sm border px-4 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                {doc.name}
              </a >
            ))}

          </div>

        </div>
      )}

      {/* ===== SEO CONTENT ===== */}
      <div className="border-t pt-12">

        <div className="max-w-4xl space-y-4 text-gray-600 leading-relaxed">

          <h2 className="text-2xl font-semibold text-black">
            Move-In Ready Showhome Living in Christchurch
          </h2>

          <p>
            {layout.name} is a real New Zealand showhome project
            designed to demonstrate how MoveInReady combines
            home layouts, furniture packages and staging into
            a complete move-in ready experience.
          </p >

          <p>
            This Christchurch layout features curated furniture
            packages tailored to modern New Zealand living,
            helping homeowners visualise complete furnishing
            solutions before moving into their homes.
          </p >

        </div>

      </div>

    </div>
  )
}