// /api/admin/product-builder-add/route.ts

import { supabase } from "@/lib/supabase"

export async function POST(
  req: Request
) {

  try {

    const {

      package_id,

      room_id,

      item_type_id,

      opening_id,

      product_id,

      variant_id,

      quantity,

    } = await req.json()

    const {
      data: packageItem,
      error: itemError,
    } = await supabase
      .from("package_items")
      .select(`
        id
      `)
      .eq(
        "package_room_id",
        room_id
      )
      .eq(
        "item_type_id",
        item_type_id
      )
      .single()

    if (
      itemError ||
      !packageItem
    ) {

      return Response.json(
        {
          error:
            "Package item not found.",
        },
        {
          status: 400,
        }
      )

    }

    const {
      error,
    } = await supabase
      .from(
        "package_item_products"
      )
      .insert({

        package_item_id:
          packageItem.id,

        opening_id:
          opening_id || null,

        product_id,

        variant_id,

        quantity,

      })

    if (error) {

      throw error

    }

    return Response.json({
      success: true,
    })

  } catch (error: any) {

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

}