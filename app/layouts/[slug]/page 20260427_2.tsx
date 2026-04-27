import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"
import Link from "next/link"

export default async function LayoutDetail({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // ===== 1️⃣ 获取 layout =====
  const { data: layout, error } = await supabase
    .from("layouts")
    .select("*")
    .eq("slug", slug)
    .single()

  if (error || !layout) {
    return notFound()
  }

  // ===== 2️⃣ 获取 packages =====
  const { data: packages } = await supabase
    .from("packages")
    .select("id, name, slug, display_price")
    .eq("layout_id", layout.id)
    .order("name")

  // ===== 3️⃣ 获取文件 =====
  const { data: files } = await supabase
    .from("layout_files")
    .select("*")
    .eq("layout_id", layout.id)

  const downloads = files || []

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">

      {/* ===== Header ===== */}
      <div>
        <h1 className="text-3xl font-semibold">
          {layout.name}
        </h1>

        <div className="text-gray-500 mt-1">
          {layout.location}
        </div>

        <div className="mt-3 text-sm text-gray-600">
          {layout.bedrooms} Bed · {layout.bathrooms} Bath · {layout.garage} Garage
        </div>
      </div>

      {/* ===== Main Grid ===== */}
      <div className="grid md:grid-cols-2 gap-10">

        {/* ===== LEFT ===== */}
        <div className="space-y-6">

          {/* Elevation */}
          {layout.elevation_image && (
            <div>
              <div className="text-sm text-gray-400 mb-2">
                Exterior
              </div>
              <img
                src={layout.elevation_image}
                className="rounded-xl border"
              />
            </div>
          )}

          {/* Floor Plan */}
          {layout.floorplan_image && (
            <div>
              <div className="text-sm text-gray-400 mb-2">
                Floor Plan
              </div>
              <img
                src={layout.floorplan_image}
                className="rounded-xl border"
              />
            </div>
          )}

          {/* Video */}
          {layout.video_url && (
            <div>
              <div className="text-sm text-gray-400 mb-2">
                Walkthrough
              </div>
              <iframe
                src={layout.video_url}
                className="w-full h-64 rounded-xl"
              />
            </div>
          )}

        </div>

        {/* ===== RIGHT ===== */}
        <div className="space-y-6">

          {/* Description */}
          {layout.description && (
            <div className="text-gray-600">
              {layout.description}
            </div>
          )}

          {/* ===== Packages（核心）===== */}
          {packages && packages.length > 0 && (
            <div className="border-t pt-4">
              <h2 className="text-sm font-semibold mb-3">
                Furniture Packages
              </h2>

              <div className="grid grid-cols-1 gap-3">

                {packages.map((pkg: any) => (
                  <Link
                    key={pkg.id}
                    href={`/packages/${pkg.slug}`}
                    className="border rounded-lg p-4 flex justify-between items-center hover:shadow transition"
                  >
                    <div>
                      <div className="font-medium">
                        {pkg.name} Package
                      </div>

                      {pkg.display_price && (
                        <div className="text-sm text-gray-400">
                          ${pkg.display_price}
                        </div>
                      )}
                    </div>

                    <div className="text-sm">
                      View →
                    </div>
                  </Link>
                ))}

              </div>
            </div>
          )}

          {/* ===== Documents ===== */}
          {downloads.length > 0 && (
            <div className="border-t pt-4">
              <h2 className="text-sm font-semibold mb-3">
                Documents
              </h2>

              <div className="space-y-2">
                {downloads.map((doc: any) => (
                  <a
                    key={doc.id}
                    href= "_blank"
                    className="block text-sm text-gray-600 hover:underline"
                  >
                    {doc.name}
                  </a >
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  )
}