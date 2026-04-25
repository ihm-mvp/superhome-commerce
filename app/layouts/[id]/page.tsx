import { notFound } from "next/navigation"

const layouts: any = {
  earlsbrook: {
    name: "Lot 18 Earlsbrook Showhome",
    location: "Lincoln, Christchurch",
    beds: 4,
    baths: 2,
    garage: 2,
    size: "500m² land",

    elevation: "/layouts/earlsbrook-elevation.jpg",
    floor: "/layouts/earlsbrook-floor.jpg",

    video: "", // 👉 后面可放你建e全景链接

    features: [
      "Open-plan kitchen, dining & living",
      "Dedicated office space",
      "Walk-in wardrobe & ensuite",
      "Double garage",
      "Attic storage ladder",
    ],

    description:
      "A spacious family home designed for modern living, combining open-plan comfort with practical private spaces.",

    downloads: [
      { name: "Building Consent (BC)", url: "#" },
      { name: "Floor Plan PDF", url: "#" },
      { name: "DWG File", url: "#" },
    ],
  },

  hampton: {
    name: "Lot 2 Hampton Grove",
    location: "Prebbleton, Christchurch",
    beds: 4,
    baths: 2,
    garage: 2,
    size: "379m² land",

    elevation: "/layouts/hampton-elevation.jpg",
    floor: "/layouts/hampton-floor.jpg",

    video: "",

    features: [
      "Architectural internal garden",
      "Skylights throughout living areas",
      "Hydronic underfloor heating",
      "Double basin bathrooms",
      "Designer open-plan living",
    ],

    description:
      "A high-spec architectural home featuring internal garden and skylights, designed for premium lifestyle living.",

    downloads: [
      { name: "Building Consent (BC)", url: "#" },
      { name: "Floor Plan PDF", url: "#" },
      { name: "DWG File", url: "#" },
    ],
  },
}

export default async function LayoutDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const layout = layouts[id]

  if (!layout) return notFound()

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
          {layout.beds} Bed · {layout.baths} Bath · {layout.garage} Garage
        </div>
      </div>

      {/* ===== Main Grid ===== */}
      <div className="grid md:grid-cols-2 gap-10">

        {/* LEFT: Visual */}
        <div className="space-y-6">

          {/* Elevation */}
          <div>
            <div className="text-sm text-gray-400 mb-2">
              Exterior
            </div>
            <img
              src={layout.elevation}
              className="rounded-xl border"
            />
          </div>

          {/* Floor Plan */}
          <div>
            <div className="text-sm text-gray-400 mb-2">
              Floor Plan
            </div>
            <img
              src={layout.floor}
              className="rounded-xl border"
            />
          </div>

          {/* Video */}
          {layout.video && (
            <div>
              <div className="text-sm text-gray-400 mb-2">
                Walkthrough
              </div>
              <iframe
                src={layout.video}
                className="w-full h-64 rounded-xl"
              />
            </div>
          )}

        </div>

        {/* RIGHT: Info */}
        <div className="space-y-6">

          {/* Description */}
          <div className="text-gray-600">
            {layout.description}
          </div>

          {/* Features */}
          <div>
            <h2 className="text-sm font-semibold mb-2">
              Key Features
            </h2>

            <ul className="text-sm text-gray-600 space-y-1">
              {layout.features.map((f: string) => (
                <li key={f}>• {f}</li>
              ))}
            </ul>
          </div>

          {/* ===== Packages（核心）===== */}
          <div className="border-t pt-4">
            <h2 className="text-sm font-semibold mb-3">
              Furniture Packages
            </h2>

            <div className="grid grid-cols-1 gap-3">

              {[
                { name: "Basic", price: "$15,000+" },
                { name: "Standard", price: "$25,000+" },
                { name: "Premium", price: "$40,000+" },
              ].map((pkg) => (
                <div
                  key={pkg.name}
                  className="border rounded-lg p-4 flex justify-between items-center hover:shadow"
                >
                  <div>
                    <div className="font-medium">
                      {pkg.name} Package
                    </div>
                    <div className="text-sm text-gray-400">
                      {pkg.price}
                    </div>
                  </div>

                  <div className="text-sm">
                    View →
                  </div>
                </div>
              ))}

            </div>
          </div>

          {/* ===== Downloads ===== */}
 <div className="border-t pt-4">
            <h2 className="text-sm font-semibold mb-3">
              Documents
            </h2>

            <div className="space-y-2">
              {layout.downloads.map((doc: any) => (
                <a
                  key={doc.name}
                  href= "block text-sm text-gray-600 hover:underline"
                >
                  {doc.name}
                </a >
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
} 