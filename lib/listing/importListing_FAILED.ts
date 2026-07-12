// lib/listing/importListing.ts

import { generateMarketingAssets } from "@/lib/listing/ai/generateMarketingAssets"

import { generateQrCode } from "@/lib/listing/generateQrCode"

import { validatePropertyType } from "@/lib/listing/validateResidentialListingType TEMP"

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

    return await parseHarcourtsGold(
      url
    )

  }

  throw new Error(
    "Unsupported listing source."
  )

}