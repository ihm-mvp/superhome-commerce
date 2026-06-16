import { supabase } from "@/lib/supabase"

export async function GET(
  req: Request
) {

  const { searchParams } =
    new URL(req.url)

  const categoryId =
    searchParams.get("category_id")

  const { data, error } =
    await supabase
      .from("products")
      .select(`
        id,
        sku_code,
        name,
        description,
        category_id
      `)
      .eq(
        "category_id",
        categoryId
      )
      .order("sku_code")

  if (error) {

    return Response.json(
      { error: error.message },
      { status: 500 }
    )

  }

  return Response.json(data)

}