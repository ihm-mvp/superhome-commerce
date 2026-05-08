import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"
import Link from "next/link"

export default async function LayoutDetail({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // ===== Layout =====
  const { data: layout } = await supabase
    .from("layouts")
    .select("*")
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
    .select("*")
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
              "/earlsbrook-hero-exterior.jpg"
            }
            className="w-full object-cover"
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

              {layout.land_size && (
                <div className="border rounded-lg px-4 py-2">
                  {layout.land_size}m² Land
                </div>
              )}

                            {layout.floor_size && (
                <div className="border rounded-lg px-4 py-2">
                  {layout.floor_size}
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
                Furniture Packages
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
                >

                  {/* Hero */}
                  <div className="bg-gray-100 h-52 overflow-hidden">

                    <img
                      src={`/packages/${slug}_${packageType}_overview.jpg`}
                      className="w-full h-full object-cover hover:scale-[1.02] transition"
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
                        From ${pkg.display_price} NZD
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
                    .map((item: string, idx: number) => (
                      <div
                        key={idx}
                        className="flex gap-3"
                      >

                        <div className="mt-[7px] w-1.5 h-1.5 rounded-full bg-black shrink-0" />

                        <div>
                          {item.trim()}
                        </div>

                      </div>
                    ))}

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

      {/* ===== VIDEO ===== */}
      {layout.video_url && (
        <div className="space-y-4">

          <h2 className="text-2xl font-semibold">
            Walkthrough
          </h2>

          <iframe
            src={layout.video_url}
            className="w-full h-[520px] rounded-2xl border"
          />

        </div>
      )}

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
                href= "_blank"
                className="text-sm border px-4 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                {doc.name}
              </a >
            ))}

          </div>

        </div>
      )}

    </div>
  )
}