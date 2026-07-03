// /api/admin/product-builder-products/route.ts

import { supabase } from "@/lib/supabase"

export async function GET(
  req: Request
) {

  const { searchParams } =
    new URL(req.url)

  const categoryId =
    searchParams.get(
      "category_id"
    )

  if (!categoryId) {

    return Response.json(
      []
    )

  }

  const {
    data: products,
    error,
  } = await supabase
    .from("products")
    .select(`
      id,
      sku_code,
      name,
      display_name_en,

      variants(
        id,
        size_label,
        config,
        price_rmb
      )
    `)
    .eq(
      "category_id",
      categoryId
    )
    .order(
      "sku_code",
      {
        ascending: true,
      }
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

  return Response.json(
    products || []
  )

}