// lib/listing/scanExistingListings.ts

import { parseHarcourtsGold } from "@/lib/listing/parser/parseHarcourtsGold"

export async function scanExistingListings(

  existingListings: any[],

) {

  if (

    existingListings.length === 0

  ) {

    return {

      parsedListing: null,

      compareResult: null,

      listingUpdated: false,

      openHomeUpdated: false,

    }

  }

  // ----------------------------------
  // Phase 1
  // Parse First Existing Listing
  // ----------------------------------

  const existingListing =

    existingListings[0]

  const parsedListing =

    await parseHarcourtsGold(

      existingListing.source_url,

    )

  // ----------------------------------
  // Phase 2 (Placeholder)
  // Compare Listing
  // ----------------------------------

  const compareResult = null

  // ----------------------------------
  // Phase 3 (Placeholder)
  // Update Listing
  // ----------------------------------

  const listingUpdated = false

  // ----------------------------------
  // Phase 4 (Placeholder)
  // Update Open Homes
  // ----------------------------------

  const openHomeUpdated = false

  return {

    parsedListing,

    compareResult,

    listingUpdated,

    openHomeUpdated,

  }

}