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

  const {
    error: pipError,
  } = await supabase
    .from(
      "package_item_products"
    )
    .insert([
      {
        package_item_id:
          item.id,

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