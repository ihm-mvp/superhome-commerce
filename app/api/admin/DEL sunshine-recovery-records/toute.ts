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

  const { data, error } =
    await supabase
      .from(
        "package_opening_products"
      )
      .select(`
        id,
        quantity,

        opening:layout_openings (
          room_name,
          opening_code,
          opening_type,
          width_mm,
          height_mm
        ),

        product:products (
          sku_code,
          name
        ),

        variant:variants (
          config,
          size_label
        )
      `)
      .eq(
        "package_id",
        packageId
      )

  if (error) {

    return Response.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    )

  }

  return Response.json(data)

}