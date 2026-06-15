import { supabase } from "@/lib/supabase"

export async function GET() {

  const { data, error } =
    await supabase
      .from("packages")
      .select(`
        id,
        name,
        layout_id,
        layouts (
          name
        )
      `)
      .order("name")

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