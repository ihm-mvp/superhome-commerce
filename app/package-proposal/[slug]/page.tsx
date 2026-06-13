import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {

  const { slug } = await params

  const { data: pkg } = await supabase
    .from("packages")
    .select(`
      name,
      display_price
    `)
    .eq("slug", slug)
    .single()

  if (!pkg) {
    return {
      title: "Package Proposal | MoveInReady",
    }
  }

  return {
    title: `${pkg.name} Package Proposal | MoveInReady`,
    description:
      `${pkg.name} move-in-ready furniture package proposal for modern New Zealand homes.`,
  }
}

export default async function PackageProposalPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ pdf?: string }>
}) {

  const { slug } = await params

  const { pdf } = await searchParams

  const isPdf = pdf === "1"

  // ===== Package =====

  const { data: pkg } = await supabase
    .from("packages")
    .select(`
      id,
      name,
      slug,
      display_price,
      layout_id,
      layout:layouts!packages_layout_id_fkey(
        id,
        name,
        slug
      )
    `)
    .eq("slug", slug)
    .single()

  if (!pkg) return notFound()

  const layout = Array.isArray(pkg.layout)
    ? pkg.layout[0]
    : pkg.layout

  if (!layout) return notFound()

  const layoutSlug = layout.slug
  const packageType = pkg.name?.toLowerCase()

  // ===== Rooms =====

  const { data: rooms } = await supabase
    .from("package_rooms")
    .select(`
      id,
      name,
      sort_order,
      space_type:space_types(
      display_name
    )
    `)
    .eq("package_id", pkg.id)
    .order("sort_order")

  // ===== Items =====

  const { data: items } = await supabase
    .from("package_items")
    .select(`
      id,
      package_room_id,
      item_type:item_types(name, display_name),

products:package_item_products(
  quantity,

  product:products(
    id,
    sku_code,
    image_url,
    display_name_en,
    display_description_en
  ),

  variant:variants(
    size_label,
    config,
    display_config_en,
    display_note_en,
    width_mm,
    length_mm,
    height_mm
  )
)
    `)
    .in(
      "package_room_id",
      rooms?.map(r => r.id) || []
    )

  const grouped: Record<string, any[]> = {}

  items?.forEach((i: any) => {

    if (!grouped[i.package_room_id]) {
      grouped[i.package_room_id] = []
    }

    grouped[i.package_room_id].push(i)

  })

const summaryMap: Record<
  string,
  number
> = {}

items?.forEach((item: any) => {

  const displayName =
    item.item_type?.display_name ||
    item.item_type?.name

  const qty = item.products?.reduce(
    (sum: number, p: any) =>
      sum + (p.quantity || 0),
    0
  ) || 0

  summaryMap[displayName] =
    (summaryMap[displayName] || 0) + qty

})

const packageSummary =


  Object.entries(summaryMap)
    .sort((a, b) => b[1] - a[1])

const layoutSummary: Record<
  string,
  number
> = {}

rooms?.forEach(
  (room: any) => {

    const spaceName =
      room.space_type
        ?.display_name

    if (!spaceName) return

    layoutSummary[
      spaceName
    ] =
      (layoutSummary[
        spaceName
      ] || 0) + 1

  }
)

  return (

    <div className="max-w-6xl mx-auto px-6 py-10 space-y-14">

      {isPdf && (

        <div className="border-b pb-6 break-inside-avoid">

          <div className="text-sm uppercase tracking-wide text-gray-400">
            MoveInReady
          </div>

          <div className="text-xs text-gray-500 mt-2">
            Package Proposal
          </div>

        </div>

      )}



{/* ================================================= */}
{/* HERO */}
{/* ================================================= */}

<div className="space-y-5">

  <div className="text-sm uppercase tracking-wide text-gray-400">
    MoveInReady Package Proposal
  </div>

  <h1 className="text-4xl font-semibold">
    Move-in Ready {pkg.name} Package
  </h1>

  {pkg.display_price && (
    <div className="text-2xl text-gray-700">
      Included Value ${pkg.display_price}
    </div>
  )}

<div className="max-w-3xl text-gray-600 leading-relaxed">

  <p>
    A complete turn-key move-in solution
    professionally selected for modern
    New Zealand homes.
  </p >

  <p className="mt-3">
    Furniture, window furnishings,
    styling, delivery and installation
    are coordinated as one package,
    allowing homeowners to move in
    from day one.
  </p >

</div>

{/* ===== Layout Summary ===== */}

<div className="border rounded-2xl p-4 bg-gray-50">

  <h2 className="text-xl font-semibold mb-4">
    Layout Included
  </h2>

  <div className="flex flex-wrap gap-3">

    {Object.entries(
      layoutSummary
    ).map(
      ([name, qty]) => (

        <div
          key={name}
          className="
            px-4
            py-2
            rounded-full
            bg-white
            border
            text-sm
            text-gray-700
          "
        >
          {qty} × {name}
        </div>

      )
    )}

  </div>

</div>

{/* ===== Package Summary ===== */}

<div className="border rounded-2xl p-4 bg-gray-50">

  <h2 className="text-xl font-semibold mb-4">
    Furniture Included
  </h2>

<div className="flex flex-wrap gap-3">

  {packageSummary.map(
    ([name, qty]) => (

      <div
        key={name}
        className="
          px-4
          py-2
          rounded-full
          bg-white
          border
          text-sm
          text-gray-700
        "
      >
        {qty} × {name}
      </div>

    )
  )}

</div>

</div>

</div>

      {/* ================================================= */}
      {/* WHAT'S INCLUDED */}
      {/* ================================================= */}

      <div className="border-t pt-10">

        <h2 className="text-2xl font-semibold mb-6">
          Turn-Key Benefits
        </h2>

        <div className="grid md:grid-cols-2 gap-4 text-gray-700">

          <div>✓ Window Furnishings Included</div>
          <div>✓ Professional Styling Included</div>
          <div>✓ Delivery Included</div>
          <div>✓ Installation Included</div>
          <div>✓ Ready To Move In From Day One</div>

        </div>

      </div>

      {/* ================================================= */}
      {/* ROOMS */}
      {/* ================================================= */}

      <div className="space-y-16">

        {rooms?.map((room: any) => (

          <div
            key={room.id}
            className="space-y-8 room-section"
          >

            <div className="border-b pb-3">

              <h2 className="text-3xl font-semibold">
                {room.name}
              </h2>

            </div>

            <div className="grid md:grid-cols-2 gap-6">

              {grouped[room.id]?.map((item: any) => (

                <div
                  key={item.id}
                  className="border rounded-2xl p-5 space-y-5"
                >

                  <div className="text-sm uppercase tracking-wide text-gray-400">
                    {item.item_type?.display_name}
                  </div>

                  {item.products?.map(
                    (p: any, idx: number) => (

                      <div
                        key={idx}
                        className="space-y-4"
                      >

                        {p.product?.image_url && (

                          <img
                            src={p.product.image_url}
                            className="w-full h-64 object-contain bg-gray-50 rounded-xl"
                            loading="eager"
                          />

                        )}

                        <div>

<div className="flex items-start justify-between gap-4">

  <h3 className="font-semibold text-lg">

    {p.product?.display_name_en ||
      p.product?.sku_code}

  </h3>

  <div className="text-sm text-gray-500 whitespace-nowrap">

    Qty: {p.quantity}

  </div>

</div>

{/* ===== Variant ===== */}

{(
  p.variant?.display_config_en ||
  p.variant?.config ||
  p.variant?.size_label ||
  p.variant?.width_mm ||
  p.variant?.length_mm ||
  p.variant?.height_mm
) && (

  <div className="mt-2 space-y-1">

    {(p.variant?.display_config_en ||
      p.variant?.config) && (

      <div className="text-sm font-medium text-gray-700">

        {p.variant?.display_config_en ||
          p.variant?.config}

      </div>

    )}

    {p.variant?.size_label && (

      <div className="text-sm text-gray-500">

        Size: {p.variant.size_label}

      </div>

    )}

    {p.variant?.display_note_en && (

      <div className="text-xs text-gray-500">

        {p.variant.display_note_en}

      </div>

    )}

    {(
      p.variant?.width_mm ||
      p.variant?.length_mm ||
      p.variant?.height_mm
    ) && (

      <div className="text-xs text-gray-500">

        Dimensions:{" "}

        {p.variant?.width_mm || "-"}

        ×

        {p.variant?.length_mm || "-"}

        ×

        {p.variant?.height_mm || "-"}

        mm

      </div>

    )}

  </div>

)}


                        </div>

                      </div>

                    )
                  )}

                </div>

              ))}

            </div>

          </div>

        ))}

      </div>

{/* ================================================= */}
{/* PROPOSAL SUMMARY */}
{/* ================================================= */}

<div className="page-break"></div>

<div className="border-t pt-12">

  <h2 className="text-2xl font-semibold mb-6">
    Turn-Key Services Included
  </h2>

  <div className="space-y-3 text-gray-700">

    <div>
      ✓ Furniture Included
    </div>

    <div>
      ✓ Sunshine Package Included
    </div>

    <div>
      ✓ Styling Included
    </div>

    <div>
      ✓ Delivery Included
    </div>

    <div>
      ✓ Installation Included
    </div>

  </div>

  {pkg.display_price && (

    <div className="mt-8 text-3xl font-semibold">

      Included Value ${pkg.display_price} NZD

    </div>

  )}

</div>

      {/* ================================================= */}
      {/* FOOTER */}
      {/* ================================================= */}

      <div className="border-t pt-10">

        <div className="max-w-3xl text-gray-600 leading-relaxed">

          <h2 className="text-xl font-semibold text-black mb-3">
            MoveInReady
          </h2>

          <p>
            Furniture + Sunshine + Styling
          </p >

          <p className="mt-2">
            A complete move-in-ready solution for modern
            New Zealand homes.
          </p >

        </div>

      </div>

{!isPdf && (

<>

{/* ================================================= */}
{/* REQUEST PROPOSAL */}
{/* ================================================= */}

<div className="border-t pt-12">

  <div className="max-w-xl mx-auto">

    <h2 className="text-2xl font-semibold mb-3">
      Get Your Package Proposal
    </h2>

    <p className="text-gray-600 mb-6">
      Enter your details and receive this package proposal.
    </p >

    <form
      action="/api/package-request"
      method="POST"
      className="space-y-4"
    >

      <input
        type="hidden"
        name="package_id"
        value={pkg.id}
      />

      <div>

        <label className="block text-sm mb-2">
          First Name *
        </label>

        <input
          type="text"
          name="first_name"
          required
          className="w-full border rounded-lg px-4 py-3"
        />

      </div>

      <div>

        <label className="block text-sm mb-2">
          Email *
        </label>

        <input
          type="email"
          name="email"
          required
          className="w-full border rounded-lg px-4 py-3"
        />

      </div>

      <button
        type="submit"
        className="w-full bg-black text-white py-3 rounded-lg hover:opacity-90 transition"
      >
        Send Package Proposal
      </button>

    </form>

  </div>

</div>

</>

)}

    </div>

  )
}