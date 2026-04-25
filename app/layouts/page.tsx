import Link from "next/link"

const layouts = [
  {
    id: "earlsbrook",
    name: "Lot 18 Earlsbrook Showhome",
    location: "Lincoln, Christchurch",
    beds: 4,
    baths: 2,
    garage: 2,
    size: "500m² land",
    image: "/layouts/earlsbrook-elevation.jpg", // 👉 先放public目录占位图
    tags: ["Family Living", "Office", "Open Plan"],
    description:
      "Spacious family home with open-plan kitchen, dining and living, plus a dedicated office space.",
  },
  {
    id: "hampton",
    name: "Lot 2 Hampton Grove",
    location: "Prebbleton, Christchurch",
    beds: 4,
    baths: 2,
    garage: 2,
    size: "379m² land",
    image: "/layouts/hampton-elevation.jpg",
    tags: ["Designer Home", "Internal Garden", "Skylights"],
    description:
      "Architectural showhome featuring internal garden, skylights, and high-spec living spaces.",
  },
]

export default function LayoutsPage() {
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

        {layouts.map((layout) => (
          <Link
            key={layout.id}
            href={`/layouts/${layout.id}`}
            className="group border rounded-xl overflow-hidden hover:shadow-lg transition"
          >

            {/* Image */}
            <div className="bg-gray-100 h-56 flex items-center justify-center overflow-hidden">
              <img
                src={layout.image}
                className="object-cover w-full h-full group-hover:scale-105 transition"
              />
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">

              {/* Title */}
              <div>
                <h2 className="text-lg font-semibold">
                  {layout.name}
                </h2>
                <div className="text-sm text-gray-400">
                  {layout.location}
                </div>
              </div>

              {/* Specs */}
              <div className="text-sm text-gray-600">
                {layout.beds} Bed · {layout.baths} Bath · {layout.garage} Garage
              </div>

              <div className="text-xs text-gray-400">
                {layout.size}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {layout.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-gray-100 px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Description */}
              <div className="text-sm text-gray-500 line-clamp-2">
                {layout.description}
              </div>

              {/* CTA */}
              <div className="pt-2 text-sm font-medium text-black">
                View Layout →
              </div>

            </div>
          </Link>
        ))}

      </div>
    </div>
  )
}