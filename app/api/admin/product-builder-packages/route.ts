// /api/admin/product-builder-packages/route.ts

import { supabase } from "@/lib/supabase"

export async function GET() {

  const {
    data,
    error,
  } = await supabase
    .from("packages")
    .select(`
      id,
      name,
      layout_id,

      layouts(
        id,
        name,
        slug
      )
    `)
    .order(
      "sort_order",
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
    data || []
  )

}