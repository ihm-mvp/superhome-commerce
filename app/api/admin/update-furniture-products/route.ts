import { supabase } from "@/lib/supabase"

export async function POST(
  req: Request
) {

  try {

    const { data } =
      await req.json()

    for (
      const room of data
    ) {

      for (
        const item of room.items
      ) {

        for (
          const pip of item.pips
        ) {

          const {
            error,
          } = await supabase
            .from(
              "package_item_products"
            )
            .update({

              product_id:
                pip.product_id,

              variant_id:
                pip.variant_id,

            })
            .eq(
              "id",
              pip.id
            )

          if (error) {

            throw error

          }

        }

      }

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