import { supabase } from "@/lib/supabase"

export async function GET(
  req: Request
) {

  const { searchParams } =
    new URL(req.url)

  const layoutId =
    searchParams.get("layout_id")

  const roomName =
    searchParams.get("room_name")

  let query =
    supabase
      .from("layout_openings")
      .select(`
        id,
        opening_code,
        opening_type,
        width_mm,
        height_mm,
        room_name
      `)
      .eq(
        "layout_id",
        layoutId
      )

  if (roomName) {

    query =
      query.eq(
        "room_name",
        roomName
      )

  }

  const {
    data,
    error,
  } = await query
    .order(
      "opening_code"
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
    data
  )

}