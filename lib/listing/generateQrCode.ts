import QRCode from "qrcode"

import { supabase } from "@/lib/supabase"

export async function generateQrCode(
  slug: string
) {

  const listingUrl =

    `${process.env.NEXT_PUBLIC_SITE_URL}/listing/${slug}`

  const pngBuffer =

    await QRCode.toBuffer(

      listingUrl,

      {

        width: 800,

        margin: 2,

      }

    )

  const filePath =

    `listing-qrcodes/${slug}.png`

  const {

    error,

  } = await supabase

    .storage

    .from(

      "home-products"

    )

    .upload(

      filePath,

      pngBuffer,

      {

        contentType:

          "image/png",

        upsert: true,

      }

    )

  if (

    error

  ) {

    throw error

  }

  const {

    data,

  } = supabase

    .storage

    .from(

      "home-products"

    )

    .getPublicUrl(

      filePath

    )

return {

  qrcode_url:

    data.publicUrl,

}

}