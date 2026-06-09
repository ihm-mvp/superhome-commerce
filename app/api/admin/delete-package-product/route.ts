import { supabase } from "@/lib/supabase"

export async function POST(
  req: Request
) {

  const {
    pipId,
    itemId,
  } = await req.json()

  await supabase
    .from(
      "package_item_products"
    )
    .delete()
    .eq(
      "id",
      pipId
    )

  const {
    data: remaining,
  } = await supabase
    .from(
      "package_item_products"
    )
    .select("id")
    .eq(
      "package_item_id",
      itemId
    )

  if (
    !remaining ||
    remaining.length === 0
  ) {

    await supabase
      .from(
        "package_items"
      )
      .delete()
      .eq(
        "id",
        itemId
      )

  }

  return Response.json({
    success: true,
  })

}