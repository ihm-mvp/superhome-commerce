// lib/listing/importListing.ts

import { generateMarketingAssets } from "@/lib/listing/ai/generateMarketingAssets"

import { generateQrCode } from "@/lib/listing/generateQrCode"

import { validateResidentialListing } from "@/lib/listing/validateResidentialListing"

import {

  parseHarcourtsGold,

} from "@/lib/listing/parser/parseHarcourtsGold"

export async function importListing(
  url: string
) {

  if (
    url.includes(
      "harcourtsgold.co.nz"
    )
  ) {

const listing =

  await parseHarcourtsGold(

    url

  )

if (

  !listing

) {

  return null

}

const {

  supported,

} = validateResidentialListing(

  listing.bedrooms,

  listing.bathrooms,

)

if (

  !supported

) {

  return null

}

const aiContent =

  await generateMarketingAssets({

    ...listing,

  })

const slug =

  listing.address

    .toLowerCase()

    .replace(/\//g, "-")

    .replace(/,/g, "")

    .replace(/\./g, "")

    .replace(/\s+/g, "-")

    .replace(/-+/g, "-")

    .replace(/^-|-$/g, "")

    .replace(/[^a-z0-9-]/g, "")

    const qrcode_url =

  await generateQrCode(
    slug
  )

  return {

  ...listing,

  slug,

  qrcode_url,

  ai_content:

    aiContent,

}

  }

  throw new Error(
    "Unsupported listing source."
  )

}
