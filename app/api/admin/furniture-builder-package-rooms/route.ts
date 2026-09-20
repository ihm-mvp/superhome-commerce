import { supabase } from "@/lib/supabase"

export async function GET(
  req: Request
) {

  const { searchParams } =
    new URL(req.url)

  const packageId =
    searchParams.get("package_id")

  const { data, error } =
    await supabase
      .from("package_rooms")
      .select(`
        id,
        name,
        package_id
      `)
      .eq(
        "package_id",
        packageId
      )
      .order(
        "sort_order"
      )

  if (error) {

    return Response.json(
      { error: error.message },
      { status: 500 }
    )

  }

  return Response.json(data)

}