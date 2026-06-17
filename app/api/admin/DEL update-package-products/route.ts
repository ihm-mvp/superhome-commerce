import { supabase } from "@/lib/supabase"

export async function POST(
  req: Request
) {

  const { data } =
    await req.json()

  // ====================
  // 前端所有 pip id
  // ====================

  const incomingPipIds =
    new Set<string>()

  for (const room of data) {

    for (const item of room.items) {

      for (const p of item.pips) {

        incomingPipIds.add(
          p.id
        )

      }

    }

  }

  // ====================
  // 数据库所有 pip
  // ====================

  const {
    data: dbPips,
  } = await supabase
    .from(
      "package_item_products"
    )
    .select(`
      id,
      package_item_id
    `)

  // ====================
  // DELETE
  // ====================

  for (
    const dbPip of
    dbPips || []
  ) {

    if (
      !incomingPipIds.has(
        dbPip.id
      )
    ) {

      await supabase
        .from(
          "package_item_products"
        )
        .delete()
        .eq(
          "id",
          dbPip.id
        )

    }

  }

  // ====================
  // UPDATE
  // ====================

  for (const room of data) {

    for (const item of room.items) {

      for (const p of item.pips) {

        await supabase
          .from(
            "package_item_products"
          )
          .update({

            product_id:
              p.product_id,

            variant_id:
              p.variant_id,

          })
          .eq(
            "id",
            p.id
          )

      }

    }

  }

  // ====================
  // 清理空 package_item
  // ====================

  const {
    data: items,
  } = await supabase
    .from(
      "package_items"
    )
    .select("id")

  for (
    const item of
    items || []
  ) {

    const {
      data: products,
    } = await supabase
      .from(
        "package_item_products"
      )
      .select("id")
      .eq(
        "package_item_id",
        item.id
      )

    if (
      !products ||
      products.length === 0
    ) {

      await supabase
        .from(
          "package_items"
        )
        .delete()
        .eq(
          "id",
          item.id
        )

    }

  }

  return Response.json({
    success: true,
  })

}