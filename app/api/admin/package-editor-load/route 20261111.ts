import { supabase } from "@/lib/supabase"

export async function GET(
  req: Request
) {

  const { searchParams } =
    new URL(req.url)

  const packageId =
    searchParams.get(
      "package_id"
    )

  if (!packageId) {

    return Response.json(
      {
        error:
          "package_id required",
      },
      {
        status: 400,
      }
    )

  }

  const {
    data: rooms,
    error: roomError,
  } = await supabase
    .from("package_rooms")
    .select(`
      id,
      name,

      package_items(
        id,

        item_types(
          id,
          name,
          category_id
        ),

        package_item_products(
          id,
          quantity,
          product_id,
          variant_id,
          opening_id
        )
      )
    `)
    .eq(
      "package_id",
      packageId
    )
    .order(
      "sort_order"
    )

  if (roomError) {

    return Response.json(
      {
        error:
          roomError.message,
      },
      {
        status: 500,
      }
    )

  }

  const {
    data: products,
  } = await supabase
    .from("products")
    .select(`
      id,
      sku_code,
      name,
      description,
      category_id
    `)

  const {
    data: variants,
  } = await supabase
    .from("variants")
    .select(`
      id,
      product_id,
      config,
      size_label,
      price_rmb
    `)

const {
  data: pkg,
} = await supabase
  .from("packages")
  .select(`
    layout_id
  `)
  .eq(
    "id",
    packageId
  )
  .single()

const {
  data: openings,
} = await supabase
  .from("layout_openings")
  .select(`
    id,
    room_name,
    opening_code
  `)
  .eq(
    "layout_id",
    pkg?.layout_id
  )

  const result =
    (rooms || []).map(
      (room: any) => ({

        id:
          room.id,

        name:
          room.name,

        items:
          (
            room.package_items ||
            []
          ).map(
            (item: any) => {

              const itemType =
                item.item_types

              const categoryProducts =
                (
                  products ||
                  []
                ).filter(
                  (
                    p: any
                  ) =>
                    p.category_id ===
                    itemType?.category_id
                )

              return {

                id:
                  item.id,

                item_type_name:
                  itemType?.name,

                pips:
                  (
                    item.package_item_products ||
                    []
                  ).map(
                    (pip: any) => ({

                      id:
                        pip.id,

                      quantity:
                        pip.quantity,

                      product_id:
                        pip.product_id,

                      variant_id:
                        pip.variant_id,

                      opening_id:
                        pip.opening_id,

                      openings:
                        openings || [],

                      options:
                        categoryProducts.map(
                          (
                            product: any
                          ) => ({

                            id:
                              product.id,

                            sku_code:
                              product.sku_code,

                            name:
                              product.name,

                            description:
                              product.description,

                            variants:
                              (
                                variants ||
                                []
                              ).filter(
                                (
                                  v: any
                                ) =>
                                  v.product_id ===
                                  product.id
                              ),

                          })
                        ),

                    })
                  ),

              }

            }
          ),

      })
    )

  return Response.json(
    result
  )

}