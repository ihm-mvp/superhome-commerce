// /app/api/admin/clone-package/route.ts
import { supabase } from "@/lib/supabase"

export async function POST(req: Request) {
  const body = await req.json()

  const { source_package_id, name } = body

  // 1️⃣ 创建新 package
  const { data: newPkg } = await supabase
    .from("packages")
    .insert([
      {
        name,
        slug: name.toLowerCase(),
      },
    ])
    .select()
    .single()

  // 2️⃣ 复制 rooms
  const { data: rooms } = await supabase
    .from("package_rooms")
    .select("*")
    .eq("package_id", source_package_id)

  for (const room of rooms || []) {
    const { data: newRoom } = await supabase
      .from("package_rooms")
      .insert({
        package_id: newPkg.id,
        name: room.name,
      })
      .select()
      .single()

    // 3️⃣ 复制 items
    const { data: items } = await supabase
      .from("package_items")
      .select("*")
      .eq("package_room_id", room.id)

    for (const item of items || []) {
      const { data: newItem } = await supabase
        .from("package_items")
        .insert({
          package_room_id: newRoom.id,
          product_id: item.product_id,
          variant_id: item.variant_id,
          quantity: item.quantity,
        })
        .select()
        .single()

      // 4️⃣ 复制 package_item_products
      const { data: pips } = await supabase
        .from("package_item_products")
        .select("*")
        .eq("package_item_id", item.id)

      for (const pip of pips || []) {
        await supabase
          .from("package_item_products")
          .insert({
            package_item_id: newItem.id,
            product_id: pip.product_id,
            quantity: pip.quantity,
          })
      }
    }
  }

  return Response.json({ success: true })
}