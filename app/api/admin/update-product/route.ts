import { supabase } from "@/lib/supabase"

export async function POST(
  req: Request
) {

  try {

    const { data } =
      await req.json()

    for (
      const product of data
    ) {

      const {
        error:
          productError,
      } = await supabase
        .from("products")
        .update({

          sku_code:
            product.sku_code,

          name:
            product.name,

          display_name_en:
            product.display_name_en,

          description:
            product.description,

          display_description_en:
            product.display_description_en,

        })
        .eq(
          "id",
          product.id
        )

      if (
        productError
      ) {

        throw productError

      }

      for (
        const variant of
        product.variants
      ) {

        const {
          error:
            variantError,
        } = await supabase
          .from("variants")
          .update({

            size_label:
              variant.size_label,

            config:
              variant.config,

            display_config_en:
              variant.display_config_en,

            display_note_en:
              variant.display_note_en,

            width_mm:
              variant.width_mm,

            length_mm:
              variant.length_mm,

            height_mm:
              variant.height_mm,

            price_rmb:
              variant.price_rmb,

          })
          .eq(
            "id",
            variant.id
          )

        if (
          variantError
        ) {

          throw variantError

        }

      }

    }

    return Response.json({
      success: true,
    })

  } catch (
    error: any
  ) {

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