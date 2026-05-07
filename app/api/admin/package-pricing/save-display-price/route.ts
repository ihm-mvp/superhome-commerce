// /app/api/admin/package-pricing/save-display-price/route.ts

import { supabase } from "@/lib/supabase"

export async function POST(req: Request) {

  const body = await req.json()

  const {
    package_id,
    display_price,
  } = body

  await supabase
    .from("packages")
    .update({
      display_price,
    })
    .eq("id", package_id)

  return Response.json({
    success: true,
  })
}