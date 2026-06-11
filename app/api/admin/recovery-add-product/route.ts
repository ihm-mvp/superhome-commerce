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

  let packageItemId = ""

  const {
    data: existingItem,
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

  if (existingItem) {

    packageItemId =
      existingItem.id

    await supabase
      .from("package_items")
      .update({
        quantity:
          (existingItem.quantity || 0)
          + quantity,
      })
      .eq(
        "id",
        existingItem.id
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