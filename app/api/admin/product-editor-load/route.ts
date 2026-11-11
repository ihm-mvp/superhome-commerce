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
      display_description_en,

      supplier:suppliers(
        id,
        name
      ),

      category:categories(
        id,
        name
      )
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

      price_rmb,
      retail_price_nzd
    `)

  const {
    data: suppliers,
  } = await supabase
    .from("suppliers")
    .select(`
      id,
      name
    `)
    .order("name")

  const {
    data: categories,
  } = await supabase
    .from("categories")
    .select(`
      id,
      name
    `)
    .order("name")

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

  return Response.json({

    products:
      result,

    suppliers:
      suppliers || [],

    categories:
      categories || [],

  })

}