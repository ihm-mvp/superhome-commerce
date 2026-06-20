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
  // Furniture
  // =====================================

  const { data: items } =
    await supabase
      .from("package_items")
      .select(`
        id,
        package_room_id,

        products:package_item_products(

          quantity,

          product:products(
            sku_code
          ),

          variant:variants(
            price_rmb,
            config,
            size_label
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

    // ====================
    // Sunshine Products
    // Skip here
    // Cost comes from
    // package_opening_products
    // ====================

    if (
      sku.startsWith("SUN-")
    ) {

      return

    }

    rows.push({

      room_name:
        room?.name || "",

        opening_id:
    p.opening_id || null,

      opening_code: "",

      sku_code:
        sku,

      quantity:
        p.quantity || 1,

      exw_price_rmb:
        p.variant?.price_rmb || 0,

      width_mm: null,

      height_mm: null,

      variant_config:
        [
          p.variant?.size_label,
          p.variant?.config,
        ]
          .filter(Boolean)
          .join(" "),

    })

  }
)

    }
  )

  // =====================================
  // Sunshine Opening Products
  // =====================================

  const {
    data: openingProducts,
  } =
    await supabase
      .from(
        "package_opening_products"
      )
.select(`

  id,

  opening:layout_openings(

    width_mm,
    height_mm

  ),

  product:products(

    id,
    sku_code

  ),

  variant:variants(

    id,
    price_rmb

  )

`)
      .eq(
        "package_id",
        packageId
      )

  openingProducts?.forEach(
    (row: any) => {

      rows.push({

        room_name:
          row.opening
            ?.room_name || "",

            opening_id:
    row.opening?.id || null,

        opening_code:
          row.opening
            ?.opening_code || "",

        sku_code:
          row.product
            ?.sku_code || "",

        quantity:
          row.quantity || 1,

        exw_price_rmb:
          row.variant
            ?.price_rmb || 0,

        width_mm:
          row.opening
            ?.width_mm || null,

        height_mm:
          row.opening
            ?.height_mm || null,

        variant_config:
          [
            row.variant
              ?.size_label,
            row.variant
              ?.config,
          ]
            .filter(Boolean)
            .join(" "),

      })

    }
  )

  return Response.json(
    rows
  )

}