// /app/api/admin/package-pricing/package-details/route.ts

import { supabase } from "@/lib/supabase"

export async function GET(req: Request) {

  const { searchParams } =
    new URL(req.url)

  const packageId =
    searchParams.get("package_id")

  if (!packageId) {
    return Response.json([])
  }

  // ===== rooms =====
  const { data: rooms } = await supabase
    .from("package_rooms")
    .select("id, name")
    .eq("package_id", packageId)

  if (!rooms?.length) {
    return Response.json([])
  }

  // ===== items =====
  const { data: items } = await supabase
    .from("package_items")
    .select(`
      id,
      package_room_id,
      products:package_item_products(
        quantity,
        product:products(
          sku_code,
          exw_price_rmb
        )
      )
    `)
    .in(
      "package_room_id",
      rooms.map((r) => r.id)
    )

  const rows: any[] = []

  items?.forEach((item: any) => {

    const room = rooms.find(
      (r) => r.id === item.package_room_id
    )

    item.products?.forEach((p: any) => {

      rows.push({
        room_name: room?.name || "",
        sku_code: p.product?.sku_code || "",
        quantity: p.quantity || 1,
        exw_price_rmb:
          p.product?.exw_price_rmb || 0,
      })
    })
  })

  return Response.json(rows)
}