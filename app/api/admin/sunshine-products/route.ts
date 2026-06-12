import { supabase } from "@/lib/supabase"

export async function GET(
  req: Request
) {

  const { searchParams } =
    new URL(req.url)

  const itemType =
    searchParams.get(
      "item_type"
    )

  let skuPrefix = ""

  if (
    itemType === "curtain"
  ) {

    skuPrefix =
      "SUN-CUR-"

  }

  if (
    itemType === "track"
  ) {

    skuPrefix =
      "SUN-TRK-"

  }

  if (
    itemType === "blind"
  ) {

    skuPrefix =
      "SUN-BLD-"

  }

  const {
    data,
    error,
  } = await supabase
    .from("products")
    .select(`
      id,
      sku_code,
      name,
      description,
      category_id
    `)
    .ilike(
      "sku_code",
      `${skuPrefix}%`
    )
    .order(
      "sku_code"
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