import { supabase } from "@/lib/supabase"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { variant_id, retail_price_nzd } = body

    if (!variant_id) {
      return Response.json(
        { error: "variant_id required" },
        { status: 400 }
      )
    }

    const price = Number(retail_price_nzd)

    if (
      !Number.isFinite(price) ||
      price <= 0
    ) {
      return Response.json(
        { error: "A valid retail price greater than zero is required" },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from("variants")
      .update({
        retail_price_nzd: price,
      })
      .eq("id", variant_id)
      .select(`
        id,
        product_id,
        price_rmb,
        retail_price_nzd
      `)
      .single()

    if (error) {
      return Response.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return Response.json({
      success: true,
      variant: data,
    })

  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    )
  }
}