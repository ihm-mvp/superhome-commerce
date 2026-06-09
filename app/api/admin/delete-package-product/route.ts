import { supabase } from "@/lib/supabase"

export async function POST(
  req: Request
) {

  const {
    pipId,
    itemId,
  } = await req.json()

  console.log(
    "DELETE REQUEST",
    {
      pipId,
      itemId,
    }
  )

  const deleteResult =
    await supabase
      .from(
        "package_item_products"
      )
      .delete()
      .eq(
        "id",
        pipId
      )
      .select()

  console.log(
    "DELETE RESULT",
    deleteResult
  )

  const {
    data: remaining,
    error: remainingError,
  } = await supabase
    .from(
      "package_item_products"
    )
    .select("id")
    .eq(
      "package_item_id",
      itemId
    )

  console.log(
    "REMAINING RESULT",
    {
      remaining,
      remainingError,
    }
  )

  if (
    !remaining ||
    remaining.length === 0
  ) {

    const itemDeleteResult =
      await supabase
        .from(
          "package_items"
        )
        .delete()
        .eq(
          "id",
          itemId
        )
        .select()

    console.log(
      "ITEM DELETE RESULT",
      itemDeleteResult
    )

  }

  return Response.json({
    success: true,
  })

}