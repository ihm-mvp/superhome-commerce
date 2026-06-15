import { supabase } from "@/lib/supabase"

export async function GET(
  req: Request
) {

  const { searchParams } =
    new URL(req.url)

  const packageId =
    searchParams.get("package_id")

  if (!packageId) {
    return Response.json([])
  }

  const { data: pkg } =
    await supabase
      .from("packages")
      .select(`
        layout_id
      `)
      .eq("id", packageId)
      .single()

  if (!pkg?.layout_id) {
    return Response.json([])
  }

  const { data, error } =
    await supabase
      .from("layout_openings")
      .select(`
        id,
        room_name,
        opening_code,
        opening_type,
        width_mm,
        height_mm
      `)
      .eq(
        "layout_id",
        pkg.layout_id
      )
      .order("room_name")
      .order("opening_code")

  if (error) {

    return Response.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    )

  }

  return Response.json(data)

}