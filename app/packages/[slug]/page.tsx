import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"
import Link from "next/link"

export default async function PackagePage({
  params,
}: {
  params: { slug: string }
}) {
  const slug = params.slug

  // ===== Package =====
  const { data: pkg } = await supabase
    .from("packages")
    .select("*, layout:layouts(id, slug, name)")
    .eq("slug", slug)
    .single()

  if (!pkg) return notFound()

  // ===== 同layout下所有packages（用于切换）=====
  const { data: allPackages } = await supabase
    .from("packages")
    .select("name, slug")
    .eq("layout_id", pkg.layout_id)

  // ===== Rooms =====
  const { data: rooms } = await supabase
    .from("package_rooms")
    .select("*")
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
        product:products(id, sku_code, image_url),
        variant:variants(size_label, config)
      )
    `)
    .in("package_room_id", rooms?.map(r => r.id) || [])

  const grouped: Record<string, any[]> = {}
  items?.forEach((i: any) => {
    if (!grouped[i.package_room_id]) grouped[i.package_room_id] = []
    grouped[i.package_room_id].push(i)
  })

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">

      {/* ===== Header（销售感）===== */}
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold">
          {pkg.name} Package
        </h1>

        {pkg.display_price && (
          <div className="text-xl text-gray-600">
            ${pkg.display_price}+
          </div>
        )}

        <div className="text-gray-500">
          Designed to perfectly match {pkg.layout?.name}
        </div>
      </div>

      {/* ===== Package切换 ===== */}
      <div className="flex gap-3">
        {allPackages?.map((p: any) => (
          <Link
            key={p.slug}
            href={`/packages/${p.slug}`}
            className={`px-4 py-2 border rounded-lg text-sm ${
              p.slug === slug ? "bg-black text-white" : ""
            }`}
          >
            {p.name}
          </Link>
        ))}
      </div>

      {/* ===== Rooms（视觉块）===== */}
      <div className="space-y-12">

        {rooms?.map((room: any) => (
          <div key={room.id} className="space-y-4">

            <h2 className="text-xl font-semibold">
              {room.name}
            </h2>

            <div className="grid md:grid-cols-2 gap-4">

              {grouped[room.id]?.map((item: any) => (
                <div
                  key={item.id}
                  className="border rounded-xl p-4 space-y-3"
                >

                  <div className="text-sm text-gray-500">
                    {item.item_type?.name}
                  </div>

                  {item.products?.map((p: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3"
                    >

                      {p.product?.image_url && (
                        <img
                          src={p.product.image_url}
                          className="w-16 h-16 object-contain"
                        />
                      )}

                      <div className="text-sm">
                        <div className="font-medium">
                          {p.product?.sku_code}
                        </div>

                        {(p.variant?.size_label || p.variant?.config) && (
                          <div className="text-gray-400 text-xs">
                            {p.variant?.size_label} {p.variant?.config}
                          </div>
                        )}
                      </div>

                      <div className="ml-auto text-sm text-gray-500">
                        x{p.quantity}
                      </div>

                    </div>
                  ))}

                </div>
              ))}

            </div>

          </div>
        ))}

      </div>

      {/* ===== CTA（未来）===== */}
      <div className="border-t pt-6">
        <button className="px-6 py-3 bg-black text-white rounded-lg">
          Enquire This Package
        </button>
      </div>

    </div>
  )
}