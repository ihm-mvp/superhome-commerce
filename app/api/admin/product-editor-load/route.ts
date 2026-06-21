import { supabase } from "@/lib/supabase"

export async function GET() {

  const {
    data: products,
    error,
  } = await supabase
    .from("products")
    .select(`
      id,
      supplier_id,
      category_id,
      sku_code,
      name,
      display_name_en,
      description,
      display_description_en
    `)
    .order(
      "sku_code"
    )

  if (error) {

    return Response.json(
      {
        error:
          error.message,
      },
      {
        status: 500,
      }
    )

  }

  const {
    data: variants,
  } = await supabase
    .from("variants")
    .select(`
      id,
      product_id,

      size_label,
      config,

      display_config_en,
      display_note_en,

      width_mm,
      length_mm,
      height_mm,

      price_rmb
    `)

  const result =
    (products || []).map(
      (product: any) => ({

        ...product,

        variants:
          (
            variants || []
          ).filter(
            (v: any) =>
              v.product_id ===
              product.id
          ),

      })
    )

  return Response.json(
    result
  )

}