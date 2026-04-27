import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"

export default async function PackagePage({
  params,
}: {
  params: { slug: string }
}) {
  const { slug } = params

  // ===== Package =====
  const { data: pkg } = await supabase
    .from("packages")
    .select("*")
    .eq("slug", slug)
    .single()

  if (!pkg) return notFound()

  // ===== Rooms =====
  const { data: rooms } = await supabase
    .from("package_rooms")
    .select("*")
    .eq("package_id", pkg.id)
    .order("sort_order", { ascending: true })

  // ===== Items + Products =====
  const { data: items } = await supabase
    .from("package_items")
    .select(`
      id,
      package_room_id,
      quantity,
      item_type:item_types(name),
      products:package_item_products(
        quantity,
        product:products(
          sku_code,
          name
        ),
        variant:variants(
          size_label,
          config
        )
      )
    `)
    .in("package_room_id", rooms?.map(r => r.id) || [])

  // ===== 分组 =====
  const grouped: Record<string, any[]> = {}

  items?.forEach((item: any) => {
    const roomId = item.package_room_id

    if (!grouped[roomId]) grouped[roomId] = []
    grouped[roomId].push(item)
  })

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">

      {/* ===== Header ===== */}
      <div>
        <h1 className="text-3xl font-semibold">
          {pkg.name} Package
        </h1>

        {pkg.display_price && (
          <div className="text-xl text-gray-600 mt-2">
            ${pkg.display_price}
          </div>
        )}
      </div>

      {/* ===== Rooms ===== */}
      <div className="space-y-10">

        {rooms?.map((room: any) => (
          <div key={room.id} className="space-y-4">

            {/* Room Title */}
            <h2 className="text-xl font-semibold">
              {room.name}
            </h2>

            {/* Items */}
            <div className="space-y-3">

              {grouped[room.id]?.map((item: any) => (
                <div
                  key={item.id}
                  className="border rounded-lg p-4"
                >

                  {/* Item Type */}
                  <div className="font-medium text-sm text-gray-500">
                    {item.item_type?.name}
                  </div>

                  {/* Products */}
                  <div className="mt-2 space-y-1">

                    {item.products?.map((p: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex justify-between text-sm"
                      >
                        <div>
                          {p.product?.sku_code}

                          {/* Variant */}
                          {(p.variant?.size_label || p.variant?.config) && (
                            <span className="text-gray-400 ml-2">
                              ({p.variant?.size_label || ""} {p.variant?.config || ""})
                            </span>
                          )}
                        </div>

                        <div className="text-gray-500">
                          x{p.quantity}
                        </div>
                      </div>
                    ))}

                  </div>

                </div>
              ))}

            </div>

          </div>
        ))}

      </div>

    </div>
  )
}