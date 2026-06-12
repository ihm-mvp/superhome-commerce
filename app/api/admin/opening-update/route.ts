import { supabase } from "@/lib/supabase"

export async function POST(
  req: Request
) {

  const {
    id,
    room_name,
    opening_code,
    opening_type,
    width_mm,
    height_mm,
    sill_height_mm,
    head_height_mm,
    notes,
  } = await req.json()

  const {
    error,
  } = await supabase
    .from(
      "layout_openings"
    )
    .update({
      room_name,
      opening_code,
      opening_type,
      width_mm,
      height_mm,
      sill_height_mm,
      head_height_mm,
      notes,
    })
    .eq(
      "id",
      id
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

  return Response.json({
    success: true,
  })

}