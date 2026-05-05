// /app/api/admin/package-full/route.ts

import { supabase } from "@/lib/supabase"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const package_id = searchParams.get("package_id")

  const { data } = await supabase
    .from("package_rooms")
    .select(`
      id,
      name,
      package_items (
        id,
        item_type_id,
        item_types (name),
        package_item_products (
          id,
          product_id,
          variant_id
        )
      )
    `)
    .eq("package_id", package_id)

  const formatted = data?.map((room: any) => ({
    name: room.name,
    items: room.package_items.map((i: any) => ({
      id: i.id,
      item_type_name: i.item_types?.name,
      pips: i.package_item_products,
    })),
  }))

  return Response.json(formatted)
}