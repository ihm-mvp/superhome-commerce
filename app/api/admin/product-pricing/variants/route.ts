import { supabase } from "@/lib/supabase"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const productId = searchParams.get("product_id")

  if (!productId) {
    return Response.json(
      { error: "product_id required" },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from("variants")
    .select(`
      id,
      product_id,
      size_label,
            products (
        sku_code
      ),
      config,
      display_config_en,
      width_mm,
      length_mm,
      height_mm,
      price_rmb,
      retail_price_nzd
    `)
    .eq("product_id", productId)
    .order("created_at")

  if (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    )
  }

  return Response.json(data || [])
}