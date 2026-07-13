// lib/listing/scanExistingListings.ts

import { supabase } from "@/lib/supabase"

import { compareListing } from "@/lib/listing/compareListing"

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

  const {

  data: dbListing,

} = await supabase

  .from(

    "listing_listings"

  )

  .select("*")

  .eq(

    "id",

    existingListing.id,

  )

  .single()

const {

  data: dbOpenHomes,

} = await supabase

  .from(

    "listing_openhomes"

  )

  .select("*")

  .eq(

    "listing_id",

    existingListing.id,

  )
  
const compareResult =

  compareListing(

    dbListing,

    dbOpenHomes || [],

    parsedListing,

  )

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