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

  console.log(
    "SUNSHINE REQUEST",
    {
      package_id,
      opening_id,
      product_id,
      variant_id,
      quantity,
    }
  )

  if (
    !package_id ||
    !opening_id ||
    !product_id ||
    !variant_id
  ) {

    return Response.json(
      {
        error:
          "Missing required fields",
      },
      {
        status: 400,
      }
    )

  }

  const {
    data,
    error,
  } =
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
        },
      ])
      .select()
      .single()

  console.log(
    "SUNSHINE INSERT",
    {
      data,
      error,
    }
  )

  if (error) {

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

  return Response.json({
    success: true,
    data,
  })

}