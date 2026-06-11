import { supabase } from "@/lib/supabase"

export async function GET(
  req: Request
) {

  const { searchParams } =
    new URL(req.url)

  const productId =
    searchParams.get("product_id")

  const { data, error } =
    await supabase
      .from("variants")
      .select(`
        id,
        config,
        size_label
      `)
      .eq(
        "product_id",
        productId
      )
      .order("config")

  if (error) {

    return Response.json(
      { error: error.message },
      { status: 500 }
    )

  }

  return Response.json(data)

}