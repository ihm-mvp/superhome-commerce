// /app/api/admin/update-package-products/route.ts

import { supabase } from "@/lib/supabase"

export async function POST(req: Request) {
  const { data } = await req.json()

  for (const room of data) {
    for (const item of room.items) {
      for (const p of item.pips) {
        await supabase
          .from("package_item_products")
          .update({
            product_id: p.product_id,
            variant_id: p.variant_id,
          })
          .eq("id", p.id)
      }
    }
  }

  return Response.json({ success: true })
}