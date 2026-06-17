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

const before =
  await supabase
    .from("package_item_products")
    .select("id")
    .eq("id", pipId)

console.log(
  "BEFORE DELETE",
  before
)

const deleteResult =
  await supabase
    .from("package_item_products")
    .delete()
    .eq("id", pipId)

console.log(
  "DELETE RESULT",
  deleteResult
)

console.log(
  "DELETE PIP ID",
  pipId
)

const verify =
  await supabase
    .from(
      "package_item_products"
    )
    .select("*")
    .eq(
      "id",
      pipId
    )

console.log(
  "VERIFY AFTER DELETE",
  verify
)

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