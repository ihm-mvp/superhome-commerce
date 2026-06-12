import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"
import Link from "next/link"

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
      slug,
      layout:layouts!packages_layout_id_fkey(
        slug,
        name
      )
    `)
    .eq("slug", slug)
    .single()

  if (!pkg) {
    return {
      title: "Package Not Found | MoveInReady",
    }
  }

  // ===== 统一 layout 结构 =====
  const layout = Array.isArray(pkg.layout)
    ? pkg.layout[0]
    : pkg.layout

  const layoutName =
    layout?.name || "New Zealand Home"

  const layoutSlug =
    layout?.slug || "layout"

  const packageType =
    pkg.name?.toLowerCase() || "package"

  return {
    title: `${pkg.name} Furniture Package | ${layoutName} | MoveInReady`,

    description:
      `${pkg.name} furniture package designed for ${layoutName}. ` +
      `Explore move-in ready furniture solutions for modern New Zealand homes.`,

    keywords: [
      "move in ready furniture",
      "furniture package NZ",
      "new home furniture package",
      "fully furnished home",
      `${layoutName} furniture package`,
      `${pkg.name} package`,
      "Christchurch furniture package",
      "New Zealand home furniture",
    ],

    openGraph: {
      title: `${pkg.name} Package | ${layoutName}`,

      description:
        `Complete furniture package for ${layoutName}. ` +
        `Designed for modern move-in ready living.`,

      images: [
        `/packages/${layoutSlug}_${packageType}_overview.jpg`,
      ],
    },
  }
}

export default async function PackagePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

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
      slug,
      name,
      location,
      bedrooms,
      bathrooms,
      garage,
      floor_size
    )
  `)
    .eq("slug", slug)
    .single()

  if (!pkg) return notFound()

  // ===== 统一 layout 结构 =====
  const layout = Array.isArray(pkg.layout)
    ? pkg.layout[0]
    : pkg.layout

  if (!layout) return notFound()

  const layoutSlug = layout.slug

  const packageType =
    pkg.name?.toLowerCase()

  // ===== 同layout packages =====
  const { data: allPackages } = await supabase
    .from("packages")
    .select("name, slug")
    .eq("layout_id", pkg.layout_id)

  // ===== Rooms =====
  const { data: rooms } = await supabase
    .from("package_rooms")
    .select(`
      id,
      name,
      sort_order
    `)
    .eq("package_id", pkg.id)
    .order("sort_order")

  // ===== Items =====
  const { data: items } = await supabase
    .from("package_items")
    .select(`
      id,
      package_room_id,
      item_type:item_types(name),
      products:package_item_products(
        quantity,
        product:products(id, sku_code, display_name_en, display_description_en, image_url),
        variant:variants(size_label, config)
      )
    `)
    .in("package_room_id", rooms?.map(r => r.id) || [])

  const grouped: Record<string, any[]> = {}

  items?.forEach((i: any) => {
    if (!grouped[i.package_room_id]) {
      grouped[i.package_room_id] = []
    }

    grouped[i.package_room_id].push(i)
  })

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-12">

      {/* ===== SEO Heading ===== */}
      <div className="space-y-3">

        <div className="text-sm uppercase tracking-wide text-gray-400">
          Move-In Ready Furniture Package
        </div>

        <h1 className="text-3xl md:text-4xl font-semibold leading-tight">
          {pkg.name} Package
        </h1>

        {pkg.display_price && (
          <div className="text-xl text-gray-600">
            From ${pkg.display_price} NZD
          </div>
        )}

<div className="text-gray-500 max-w-2xl leading-relaxed">
  Fully furnished furniture package designed for{" "}
  {layout.name}. Explore a complete move-in ready
  setup for modern New Zealand living, including living,
  dining and bedroom furniture selections.
</div>

<div className="space-y-4 pt-2">

  <div className="border rounded-2xl p-5 bg-gray-50 max-w-3xl">

    <div className="text-xs uppercase tracking-wide text-gray-400">
      Layout
    </div>

    <div className="text-2xl font-semibold mt-1">
      {layout.name}
    </div>

    {layout.location && (
      <div className="text-gray-500 mt-2">
        {layout.location}
      </div>
    )}

    <div className="text-gray-500 mt-2">

      {layout.bedrooms}
      {" Bed"}

      {" · "}

      {layout.bathrooms}
      {" Bath"}

      {" · "}

      {layout.garage}
      {" Garage"}

    </div>

    {layout.floor_size && (
      <div className="text-gray-500 mt-2">
        {layout.floor_size}
      </div>
    )}

  </div>

  <Link
    href={`/package-proposal/${pkg.slug}`}
    className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:opacity-90 transition"
    prefetch={false}
  >
    Get Package Proposal
  </Link>

</div>

      </div>

{/* ===== Furniture Summary ===== */}

{(() => {

  const summary: Record<
    string,
    number
  > = {}

  items?.forEach(
    (item: any) => {

      const itemName =
        item.item_type?.name

      if (!itemName) return

      const qty =
        item.products?.reduce(
          (
            total: number,
            p: any
          ) =>
            total +
            (
              p.quantity ||
              0
            ),
          0
        ) || 0

      summary[itemName] =
        (
          summary[
            itemName
          ] || 0
        ) + qty

    }
  )

  return (

    <div
      className="
        border
        rounded-2xl
        p-5
        max-w-4xl
      "
    >

      <div
        className="
          font-semibold
          text-lg
          mb-4
        "
      >
        Furniture Included
      </div>

      <div
        className="
          flex
          flex-wrap
          gap-3
        "
      >

        {Object.entries(
          summary
        ).map(
          (
            [name, qty]
          ) => (

            <div
              key={name}
              className="
                px-4
                py-2
                border
                rounded-full
                text-sm
              "
            >
              {qty}
              {" × "}
              {name}
            </div>

          )
        )}

      </div>

    </div>

  )

})()}

      {/* ===== Package切换 ===== */}
      <div className="flex gap-3 flex-wrap">

        {allPackages?.map((p: any) => (
          <Link
            key={p.slug}
            href={`/packages/${p.slug}`}
            className={`px-4 py-2 border rounded-lg text-sm transition ${
              p.slug === slug
                ? "bg-black text-white border-black"
                : "hover:bg-gray-50"
            }`}
            prefetch={false}
          >
            {p.name}
          </Link>
        ))}

      </div>

      {/* ===== Hero Image ===== */}
      <div className="space-y-3">

        <img
          src={`/packages/${layoutSlug}_${packageType}_overview.jpg`}
          className="w-full rounded-2xl border"
          loading="lazy"
        />

<div className="flex flex-wrap gap-2 text-xs text-gray-500">

  <span>
    {layout.name}
  </span>

  <span>•</span>

  <span>
    {pkg.name} Package
  </span>

</div>

      </div>

{/* ===== Room Navigation ===== */}

<div className="flex flex-wrap gap-2">

  {rooms?.map((room: any) => (

    <a
      key={room.id}
      href={`#room-${room.id}`}
      className="
        px-3
        py-2
        border
        rounded-lg
        text-sm
        hover:bg-gray-50
      "
    >
      {room.name}
    </a >

  ))}

</div>

{/* ===== Rooms ===== */}

<div className="space-y-14">

        {rooms?.map((room: any) => (
<div
  id={`room-${room.id}`}
  key={room.id}
  className="space-y-5"
>

            {/* Room Title */}
            <div className="border-b pb-2">
              <h2 className="text-2xl font-semibold">
                {room.name}
              </h2>
            </div>

            {/* Products */}
            <div className="grid md:grid-cols-2 gap-4">

              {grouped[room.id]?.map((item: any) => (
                <div
                  key={item.id}
                  className="border rounded-2xl p-4 space-y-3 hover:shadow-sm transition"
                >

                  <div className="text-sm text-gray-500">
                    {item.item_type?.name}
                  </div>

                  {item.products?.map((p: any, idx: number) => (
                    <Link
                      key={idx}
                      href={`/products/${p.product?.id}`}
                      className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition"
                      prefetch={false}
                    >

                      {p.product?.image_url && (
                        <img
                          src={p.product.image_url}
                          className="w-16 h-16 object-contain"
                          loading="lazy"
                        />
                      )}

                      <div className="text-sm flex-1">

                        <div className="font-medium">
                          {p.product?.display_name_en}
                        </div>

                        {p.product?.display_description_en && (

  <div
    className="
      text-xs
      text-gray-400
      line-clamp-2
    "
  >
    {p.product.display_description_en}
  </div>

)}

                        {(p.variant?.size_label) && (
                          <div className="text-gray-400 text-xs">
                            {p.variant?.size_label}
                          </div>
                        )}

                      </div>

                      <div className="text-sm text-gray-500">
                        x{p.quantity}
                      </div>

                    </Link>
                  ))}

                </div>
              ))}

            </div>

          </div>
        ))}

      </div>

      {/* ===== SEO Content ===== */}
      <div className="border-t pt-10">

        <div className="max-w-3xl space-y-4 text-gray-600 leading-relaxed">

          <h2 className="text-2xl font-semibold text-black">
            Move-In Ready Furniture Packages in New Zealand
          </h2>

          <p>
            MoveInReady provides complete furniture packages
            designed for real New Zealand home layouts.
            Each package is curated to simplify the move-in
            process and help homeowners furnish their homes
            faster and more efficiently.
          </p >

          <p>
            The {pkg.name} Package for {layout.name}
            includes coordinated furniture selections across
            living, dining and bedroom spaces, balancing
            comfort, functionality and contemporary aesthetics.
          </p >

        </div>

      </div>

{/* ===== CTA ===== */}
<div className="border-t pt-8 text-center">

  <Link
    href={`/package-proposal/${pkg.slug}`}
    className="inline-flex items-center px-8 py-3 bg-black text-white rounded-lg hover:opacity-90 transition"
    prefetch={false}
  >
    Get Package Proposal
  </Link>

</div>

    </div>
  )
}