// /api/admin/product-builder-item-types/route.ts

import { supabase } from "@/lib/supabase"

export async function GET() {

  const {
    data,
    error,
  } = await supabase
    .from("item_types")
    .select(`
      id,
      name,
      display_name,
      category_id
    `)
    .order(
      "name",
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

  const result =
    (data || []).map(
      (item: any) => ({

        ...item,

        is_opening_product:
          [
            "curtain",
            "track",
            "blind",
          ].includes(
            item.name
              ?.toLowerCase()
          ),

      })
    )

  return Response.json(
    result
  )

}