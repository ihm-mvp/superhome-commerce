import { supabase } from "@/lib/supabase"

export async function GET() {
  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      sku_code,
      name,
      display_name_en,
      category_id
    `)
    .order("sku_code")

  if (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    )
  }

  return Response.json(data || [])
}