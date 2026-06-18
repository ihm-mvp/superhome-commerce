// /app/api/admin/package-pricing/packages/route.ts

import { supabase } from "@/lib/supabase"

export async function GET() {

  const { data } = await supabase
    .from("packages")
    .select(`
      id,
      name,
      display_price,
      sort_order,
      layout:layouts!packages_layout_id_fkey(
        name
      )
    `)
    .order("sort_order", { ascending: true })

  const result = (data || []).map((p: any) => {

    const layout = Array.isArray(p.layout)
      ? p.layout[0]
      : p.layout

    return {
      id: p.id,
      name: p.name,
      display_price: p.display_price,
      layout_name: layout?.name || "",
    }
  })

  return Response.json(result)
}