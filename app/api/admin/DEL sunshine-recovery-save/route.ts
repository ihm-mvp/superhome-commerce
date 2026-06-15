import { supabase } from "@/lib/supabase"

export async function POST(
  req: Request
) {

  const {
    package_id,
    opening_id,
    product_id,
    variant_id,
    quantity,
  } = await req.json()

  const { error } =
    await supabase
      .from(
        "package_opening_products"
      )
      .insert([
        {
          package_id,
          opening_id,
          product_id,
          variant_id,
          quantity,
          install_included: true,
        },
      ])

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

  return Response.json({
    success: true,
  })

}