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

  "source_listing_id",

  existingListing.source_listing_id,

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

  dbListing.id,

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

let listingUpdated = false

if (

  compareResult.listingChanged

) {

  const updates: any = {}

  for (

    const field of

    compareResult.listingChangedFields

  ) {

updates[field] =

  (parsedListing as any)[field]

  }

  const {

    error: updateError,

  } = await supabase

    .from(

      "listing_listings"

    )

    .update(

      updates

    )

    .eq(

      "id",

      dbListing.id,

    )

  if (

    updateError

  ) {

    throw updateError

  }

  listingUpdated = true

}

  // ----------------------------------
  // Phase 4 (Placeholder)
  // Update Open Homes
  // ----------------------------------

let openHomeUpdated = false

if (

  compareResult.openHomeChanged

) {

  const {

    error: deleteError,

  } = await supabase

    .from(

      "listing_openhomes"

    )

    .delete()

    .eq(

      "listing_id",

      dbListing.id,

    )

  if (

    deleteError

  ) {

    throw deleteError

  }

  if (

    parsedListing.openHomes.length > 0

  ) {

    const rows =

      parsedListing.openHomes.map(

        (home: any) => ({

          listing_id:

            dbListing.id,

          ...home,

        })

      )

    const {

      error: insertError,

    } = await supabase

      .from(

        "listing_openhomes"

      )

      .insert(

        rows,

      )

    if (

      insertError

    ) {

      throw insertError

    }

  }

  openHomeUpdated = true

}

return {

  parsedListing,

  dbListing,

  dbOpenHomes,

  compareResult,

  listingUpdated,

  openHomeUpdated,

}

}