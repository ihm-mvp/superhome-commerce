// lib/listing/importListing.ts

import { generateMarketingAssets } from "@/lib/listing/ai/generateMarketingAssets"

import { generateQrCode } from "@/lib/listing/generateQrCode"

import { validateResidentialListing } from "@/lib/listing/validateResidentialListing"

import {
  parseHarcourtsGold,
} from "@/lib/listing/parser/parseHarcourtsGold"

import {
  parseHarcourtsIlam,
} from "@/lib/listing/parser/parseHarcourtsIlam"

export async function importListing(
  url: string
) {

  let listing: any

  // =====================================
  // Source Adapter
  // =====================================

  if (
    url.includes(
      "harcourtsgold.co.nz"
    )
  ) {

    listing =
      await parseHarcourtsGold(
        url
      )

  }

  else if (
    url.includes(
      "harcourts.net"
    )
  ) {

    listing =
      await parseHarcourtsIlam(
        url
      )

  }

  else {

    throw new Error(
      "Unsupported listing source."
    )

  }

  // =====================================
  // Empty / Unsupported Listing
  // =====================================

  if (
    !listing
  ) {

    return null

  }

  // =====================================
  // Residential Validation
  // =====================================

  const {
    supported,
  } =
    validateResidentialListing(
      listing.bedrooms,
      listing.bathrooms,
    )

  if (
    !supported
  ) {

    return null

  }

  // =====================================
  // AI Marketing Assets
  // =====================================

  const aiContent =
    await generateMarketingAssets({

      ...listing,

    })

  // =====================================
  // MIR Slug
  // =====================================

  const slug =
    listing.address
      .toLowerCase()
      .replace(
        /\//g,
        "-"
      )
      .replace(
        /,/g,
        ""
      )
      .replace(
        /\./g,
        ""
      )
      .replace(
        /\s+/g,
        "-"
      )
      .replace(
        /-+/g,
        "-"
      )
      .replace(
        /^-|-$/g,
        ""
      )
      .replace(
        /[^a-z0-9-]/g,
        ""
      )

  // =====================================
  // QR Code
  // =====================================

  const qrcode_url =
    await generateQrCode(
      slug
    )

  // =====================================
  // Return
  // =====================================

  return {

    ...listing,

    slug,

    qrcode_url,

    ai_content:
      aiContent,

  }

}