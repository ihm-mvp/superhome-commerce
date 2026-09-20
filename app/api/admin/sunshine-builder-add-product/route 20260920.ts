import { supabase } from "@/lib/supabase"

export async function POST(
  req: Request
) {

  const {
    package_room_id,
    item_type_id,
    product_id,
    variant_id,
    quantity,
  } = await req.json()

  console.log(
    "REQUEST",
    {
      package_room_id,
      item_type_id,
      product_id,
      variant_id,
      quantity,
    }
  )

  let packageItemId = ""

  const {
    data: existingItem,
    error: existingItemError,
  } = await supabase
    .from("package_items")
    .select(`
      id,
      quantity
    `)
    .eq(
      "package_room_id",
      package_room_id
    )
    .eq(
      "item_type_id",
      item_type_id
    )
    .maybeSingle()

  console.log(
    "EXISTING ITEM",
    existingItem
  )

  console.log(
    "EXISTING ITEM ERROR",
    existingItemError
  )

  if (existingItem) {

    packageItemId =
      existingItem.id

    const newQuantity =
      (existingItem.quantity || 0)
      + quantity

    console.log(
      "CURRENT QUANTITY",
      existingItem.quantity
    )

    console.log(
      "ADD QUANTITY",
      quantity
    )

    console.log(
      "NEW QUANTITY",
      newQuantity
    )

    const updateResult =
      await supabase
        .from("package_items")
        .update({
          quantity:
            newQuantity,
        })
        .eq(
          "id",
          existingItem.id
        )

    console.log(
      "UPDATE RESULT",
      updateResult
    )

    const verifyResult =
      await supabase
        .from("package_items")
        .select(`
          id,
          quantity
        `)
        .eq(
          "id",
          existingItem.id
        )
        .single()

    console.log(
      "VERIFY AFTER UPDATE",
      verifyResult
    )

  } else {

    const {
      data: item,
      error: itemError,
    } = await supabase
      .from("package_items")
      .insert([
        {
          package_room_id,
          item_type_id,
          quantity,
        },
      ])
      .select()
      .single()

    console.log(
      "INSERT ITEM RESULT",
      {
        item,
        itemError,
      }
    )

    if (
      itemError ||
      !item
    ) {

      return Response.json(
        {
          error:
            itemError?.message ||
            "package_items insert failed",
        },
        {
          status: 500,
        }
      )

    }

    packageItemId =
      item.id

  }

  const {
    error: pipError,
  } = await supabase
    .from(
      "package_item_products"
    )
    .insert([
      {
        package_item_id:
          packageItemId,

        product_id,

        variant_id,

        quantity,
      },
    ])

  console.log(
    "PIP INSERT ERROR",
    pipError
  )

  if (pipError) {

    return Response.json(
      {
        error:
          pipError.message,
      },
      {
        status: 500,
      }
    )

  }

  return Response.json({
    success: true,
  })

}