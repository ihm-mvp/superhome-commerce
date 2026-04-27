import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default async function LayoutsPage() {
  const { data: layouts, error } = await supabase
    .from("layouts")
    .select("*")

  // 👉 强制调试（关键）
  console.log("layouts =", layouts)
  console.log("error =", error)

  if (error) {
    return (
      <div className="p-10 text-red-500">
        Error: {error.message}
      </div>
    )
  }

  if (!layouts || layouts.length === 0) {
    return (
      <div className="p-10 text-gray-400">
        No layouts found
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">

      {/* ===== Hero ===== */}
      <div className="mb-10">
        <h1 className="text-3xl font-semibold">
          Explore Home Layouts
        </h1>

        <p className="text-gray-500 mt-2 max-w-xl">
          Browse real New Zealand home layouts and discover furniture packages
          tailored to each space.
        </p >
      </div>

      {/* ===== Grid ===== */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

        {layouts.map((layout: any) => (
          <Link
            key={layout.id}
            href={`/layouts/${layout.slug}`}
            className="group border rounded-xl overflow-hidden hover:shadow-lg transition"
          >

            <div className="bg-gray-100 h-56 overflow-hidden">
              <img
                src={layout.elevation_image}
                className="object-cover w-full h-full"
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

              <div className="text-xs text-gray-400">
                {layout.land_size}
              </div>

              <div className="text-sm text-gray-500">
                {layout.description}
              </div>

            </div>
          </Link>
        ))}

      </div>
    </div>
  )
}