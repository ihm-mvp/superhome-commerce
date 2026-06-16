import { supabase } from "@/lib/supabase"

export async function GET() {

  const {
    data,
    error,
  } = await supabase
    .from("space_types")
    .select(`
      id,
      name,
      display_name,
      sort_order
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