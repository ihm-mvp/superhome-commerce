// /app/api/admin/clone-package/route.ts
import { supabase } from "@/lib/supabase"

export async function POST(req: Request) {
  const body = await req.json()
  const { source_package_id, name } = body

  // 0️⃣ 获取 source package（拿 layout_id）
  const { data: sourcePkg } = await supabase
    .from("packages")
    .select("*")
    .eq("id", source_package_id)
    .single()

  // 1️⃣ 创建新 package（带 layout_id）
  const { data: newPkg } = await supabase
    .from("packages")
    .insert({
      name,
      slug: name.toLowerCase(),
      layout_id: sourcePkg.layout_id,
    })
    .select()
    .single()

  // 2️⃣ 读取 source rooms（按顺序）
  const { data: oldRooms } = await supabase
    .from("package_rooms")
    .select("*")
    .eq("package_id", source_package_id)
    .order("id")

  for (const oldRoom of oldRooms || []) {
    // 2️⃣ 创建新 room（复制全部字段）
    const { data: newRoom } = await supabase
      .from("package_rooms")
      .insert({
        package_id: newPkg.id,
        name: oldRoom.name,
        space_type_id: oldRoom.space_type_id,
        sort_order: oldRoom.sort_order,
      })
      .select()
      .single()

    // 3️⃣ 读取 old items（按顺序）
    const { data: oldItems } = await supabase
      .from("package_items")
      .select("*")
      .eq("package_room_id", oldRoom.id)
      .order("id")

    for (const oldItem of oldItems || []) {
      // 3️⃣ 创建新 item（完整复制字段）
      const { data: newItem } = await supabase
        .from("package_items")
        .insert({
          package_room_id: newRoom.id,
          item_type_id: oldItem.item_type_id,
          quantity: oldItem.quantity,
        })
        .select()
        .single()

      // 4️⃣ 读取 old package_item_products（按顺序）
      const { data: oldPips } = await supabase
        .from("package_item_products")
        .select("*")
        .eq("package_item_id", oldItem.id)
        .order("id")

      for (const oldPip of oldPips || []) {
        // 4️⃣ 创建新 pip（完整复制）
        await supabase
          .from("package_item_products")
          .insert({
            package_item_id: newItem.id,
            product_id: oldPip.product_id,
            variant_id: oldPip.variant_id,
            quantity: oldPip.quantity,
          })
      }
    }
  }

  return Response.json({ success: true })
}