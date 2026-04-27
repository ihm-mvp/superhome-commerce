import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"
import Link from "next/link"

export default async function PackagePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // ===== 1️⃣ Package =====
  const { data: pkg, error } = await supabase
    .from("packages")
    .select("*")
    .eq("slug", slug)
    .single()

  if (error || !pkg) return notFound()

  // ===== 2️⃣ Rooms =====
  const { data: rooms } = await supabase
    .from("package_rooms")
    .select("*")
    .eq("package_id", pkg.id)
    .order("sort_order", { ascending: true })

  // ===== 3️⃣ Items + Products + Variants =====
  const { data: items } = await supabase
    .from("package_items")
    .select(`
      id,
      package_room_id,
      item_type:item_types(name),
      products:package_item_products(
        quantity,
        product:products(
          id,
          sku_code,
          name,
          image_url
        ),
        variant:variants(
          size_label,
          config
        )
      )
    `)
    .in("package_room_id", rooms?.map(r => r.id) || [])

  // ===== 4️⃣ 分组（按 room）=====
  const grouped: Record<string, any[]> = {}

  items?.forEach((item: any) => {
    if (!grouped[item.package_room_id]) {
      grouped[item.package_room_id] = []
    }
    grouped[item.package_room_id].push(item)
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
            <div className="space-y-4">

              {grouped[room.id]?.map((item: any) => (
                <div
                  key={item.id}
                  className="border rounded-lg p-4"
                >

                  {/* Item Type */}
                  <div className="text-sm text-gray-500">
                    {item.item_type?.name}
                  </div>

                  {/* Product List */}
                  <div className="mt-3 space-y-2">

                    {item.products?.map((p: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-4 text-sm"
                      >

                        {/* LEFT */}
                        <div className="flex items-center gap-3">

                          {/* Image */}
                          {p.product?.image_url && (
                            <img
                              src={p.product.image_url}
                              className="w-12 h-12 object-contain border rounded"
                            />
                          )}

                          {/* Info */}
                          <div>
                            <Link
                              href={`/products/${p.product?.id}`}
                              className="font-medium hover:underline"
                            >
                              {p.product?.sku_code}
                            </Link>

                            {/* Variant */}
                            {(p.variant?.size_label || p.variant?.config) && (
                              <div className="text-xs text-gray-400">
                                {p.variant?.size_label || ""}{" "}
                                {p.variant?.config || ""}
                              </div>
                            )}
                          </div>

                        </div>

                        {/* RIGHT */}
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