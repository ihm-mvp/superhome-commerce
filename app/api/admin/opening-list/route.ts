import { supabase } from "@/lib/supabase"

export async function GET(
  req: Request
) {

  const { searchParams } =
    new URL(req.url)

  const layoutId =
    searchParams.get(
      "layout_id"
    )

  const {
    data,
    error,
  } = await supabase
    .from(
      "layout_openings"
    )
    .select(`
      id,
      room_name,
      opening_code,
      opening_type,
      width_mm,
      height_mm,
      sill_height_mm,
      head_height_mm,
      notes
    `)
    .eq(
      "layout_id",
      layoutId
    )
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