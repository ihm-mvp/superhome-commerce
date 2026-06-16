import { supabase } from "@/lib/supabase"

export async function GET() {

  const { data, error } =
    await supabase
      .from("item_types")
      .select(`
        id,
        name,
        category_id
      `)
      .order("name")

  if (error) {

    return Response.json(
      { error: error.message },
      { status: 500 }
    )

  }

  return Response.json(data)

}