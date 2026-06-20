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
      layout:layouts(
        name
      )
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

  return Response.json(
    data || []
  )

}