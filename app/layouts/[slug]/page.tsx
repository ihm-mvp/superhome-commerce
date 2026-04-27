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
    .order("name")

  // ===== Files =====
  const { data: files } = await supabase
    .from("layout_files")
    .select("*")
    .eq("layout_id", layout.id)

  const downloads = files || []

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-14">

      {/* ===== HERO（视觉入口）===== */}
      {layout.elevation_image && (
        <div className="space-y-4">
          <img
            src={layout.elevation_image}
            className="w-full rounded-xl object-cover"
          />

          <div>
            <h1 className="text-3xl font-semibold">
              {layout.name}
            </h1>

            <div className="text-gray-500 mt-1">
              {layout.location}
            </div>

            <div className="mt-2 text-sm text-gray-600">
              {layout.bedrooms} Bed · {layout.bathrooms} Bath · {layout.garage} Garage
            </div>
          </div>
        </div>
      )}

      {/* ===== DESCRIPTION ===== */}
      {layout.description && (
        <div className="max-w-2xl text-gray-600">
          {layout.description}
        </div>
      )}

      {/* ===== 🔥 PACKAGES（核心转化）===== */}
      {packages && packages.length > 0 && (
        <div className="space-y-6">

          <div className="flex justify-between items-end">
            <h2 className="text-2xl font-semibold">
              Furniture Packages
            </h2>

            <div className="text-sm text-gray-400">
              Designed for this layout
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">

            {packages.map((pkg: any) => {
              const packageType = pkg.name.toLowerCase()

              return (
                <Link
                  key={pkg.id}
                  href={`/packages/${pkg.slug}`}
                  className="border rounded-xl overflow-hidden hover:shadow-lg transition"
                >

                  {/* 🔥 Package整图 */}
                  <div className="bg-gray-100 h-48 overflow-hidden">
                    <img
                      src={`/packages/${slug}_${packageType}_overview.jpg`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* 内容 */}
                  <div className="p-4 space-y-2">

                    <div className="text-lg font-semibold">
                      {pkg.name}
                    </div>

                    {pkg.display_price && (
                      <div className="text-sm text-gray-500">
                        ${pkg.display_price}+
                      </div>
                    )}

                    <div className="text-xs text-gray-400">
                      Complete furniture solution
                    </div>

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
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            Floor Plan
          </h2>

          <img
            src={layout.floorplan_image}
            className="rounded-xl border"
          />
        </div>
      )}

      {/* ===== VIDEO ===== */}
      {layout.video_url && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            Walkthrough
          </h2>

          <iframe
            src={layout.video_url}
            className="w-full h-80 rounded-xl"
          />
        </div>
      )}

      {/* ===== DOCUMENTS ===== */}
      {downloads.length > 0 && (
        <div className="space-y-4 border-t pt-6">

          <h2 className="text-sm font-semibold text-gray-600">
            Documents
          </h2>

          <div className="flex flex-wrap gap-4">

            {downloads.map((doc: any) => (
              <a
                key={doc.id}
                href= "_blank"
                className="text-sm border px-4 py-2 rounded-lg hover:bg-gray-100"
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