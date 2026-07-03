// /api/admin/product-builder-rooms/route.ts

import { supabase } from "@/lib/supabase"

export async function GET(
  req: Request
) {

  const { searchParams } =
    new URL(req.url)

  const packageId =
    searchParams.get(
      "package_id"
    )

  if (!packageId) {

    return Response.json(
      []
    )

  }

  const {
    data,
    error,
  } = await supabase
    .from("package_rooms")
    .select(`
      id,
      name,
      sort_order
    `)
    .eq(
      "package_id",
      packageId
    )
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