import Link from "next/link"

const layouts = [
  {
    id: "earlsbrook",
    name: "Lot 18 Earlsbrook",
    location: "Lincoln, Christchurch",
    beds: 4,
    baths: 2,
    garage: 2,
    size: "500m² land",
    image: "/layouts/earlsbrook-elevation.jpg",
    tags: ["Family Living", "Office", "Open Plan"],
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
    tags: ["Designer", "Internal Garden", "Skylight"],
  },
]

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-16">

      {/* ===== HERO（定义你是谁）===== */}
      <div className="grid md:grid-cols-2 gap-10 items-center">

        <div className="space-y-6">
          <h1 className="text-4xl font-semibold leading-tight">
            Furnish Your Home <br />
            Before You Move In
          </h1>

          <p className="text-gray-500 max-w-md">
            Explore real New Zealand home layouts and instantly match them with complete furniture packages.
          </p >

          <div className="flex gap-4">
            <Link
              href="/layouts"
              className="px-5 py-3 bg-black text-white rounded-lg text-sm"
            >
              Browse Layouts
            </Link>

            <Link
              href="/products"
              className="px-5 py-3 border rounded-lg text-sm"
            >
              View Products
            </Link>
          </div>
        </div>

        {/* Hero Image */}
        <div className="bg-gray-100 rounded-xl overflow-hidden">
          <img
            src="/layouts/hampton-elevation.jpg"
            className="w-full h-full object-cover"
          />
        </div>

      </div>

      {/* ===== LAYOUT SECTION（70%权重）===== */}
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

          {layouts.map((layout) => (
            <Link
              key={layout.id}
              href={`/layouts/${layout.id}`}
              className="group border rounded-xl overflow-hidden hover:shadow-lg transition"
            >

              <div className="h-52 bg-gray-100 overflow-hidden">
                <img
                  src={layout.image}
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
                  {layout.beds} Bed · {layout.baths} Bath · {layout.garage} Garage
                </div>

                <div className="text-xs text-gray-400">
                  {layout.size}
                </div>

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

              </div>

            </Link>
          ))}

        </div>
      </div>

      {/* ===== PACKAGE SECTION（20%权重）===== */}
      <div className="space-y-6 border-t pt-10">

        <h2 className="text-2xl font-semibold">
          Furniture Packages
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          {[
            {
              name: "Basic",
              desc: "Essential furniture for a complete home setup",
              price: "$15,000+",
            },
            {
              name: "Standard",
              desc: "Balanced comfort and style for modern living",
              price: "$25,000+",
            },
            {
              name: "Premium",
              desc: "High-end design for premium lifestyle homes",
              price: "$40,000+",
            },
          ].map((pkg) => (
            <div
              key={pkg.name}
              className="border rounded-xl p-6 hover:shadow"
            >
              <div className="font-semibold text-lg">
                {pkg.name}
              </div>

              <div className="text-sm text-gray-500 mt-2">
                {pkg.desc}
              </div>

              <div className="mt-4 text-sm font-medium">
                {pkg.price}
              </div>

                 <div className="mt-4 text-sm">
                View Package →
              </div>
            </div>
          ))}

        </div>
      </div>

      {/* ===== PRODUCT SECTION（10%权重）===== */}
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