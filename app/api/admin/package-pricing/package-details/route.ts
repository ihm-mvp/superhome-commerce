import { supabase } from "@/lib/supabase"

export async function GET(
  req: Request
) {

  const { searchParams } =
    new URL(req.url)

  const packageId =
    searchParams.get("package_id")

  if (!packageId) {

    return Response.json([])

  }

  // =====================================
  // Package Rooms
  // =====================================

  const { data: rooms } =
    await supabase
      .from("package_rooms")
      .select(`
        id,
        name
      `)
      .eq(
        "package_id",
        packageId
      )

  if (!rooms?.length) {

    return Response.json([])

  }

  const rows: any[] = []

  // =====================================
  // Package Products
  // =====================================

  const { data: items } =
    await supabase
      .from("package_items")
      .select(`
        id,
        package_room_id,

        products:package_item_products(

          opening_id,
          quantity,

          product:products(
            sku_code
          ),

          variant:variants(
            price_rmb,
            config,
            size_label
          ),

          opening:layout_openings(

            id,
            room_name,
            opening_code,
            width_mm,
            height_mm

          )

        )

      `)
      .in(
        "package_room_id",
        rooms.map(
          (r) => r.id
        )
      )

  items?.forEach(
    (item: any) => {

      const room =
        rooms.find(
          (r) =>
            r.id ===
            item.package_room_id
        )

      item.products?.forEach(
        (p: any) => {

          const sku =
            p.product?.sku_code || ""

          rows.push({

            room_name:

              p.opening?.room_name ||

              room?.name ||

              "",

            opening_id:

              p.opening_id ||

              null,

            opening_code:

              p.opening
                ?.opening_code ||

              "",

            sku_code:

              sku,

            quantity:

              p.quantity || 1,

            exw_price_rmb:

              p.variant
                ?.price_rmb || 0,

            width_mm:

              p.opening
                ?.width_mm || null,

            height_mm:

              p.opening
                ?.height_mm || null,

            variant_config:

              [
                p.variant
                  ?.size_label,

                p.variant
                  ?.config,

              ]
                .filter(Boolean)
                .join(" "),

          })

        }
      )

    }
  )

  return Response.json(
    rows
  )

}