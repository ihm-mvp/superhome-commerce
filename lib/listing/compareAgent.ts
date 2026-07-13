// lib/listing/compareAgent.ts

import { supabase } from "@/lib/supabase"

type ScanListing = {

  source_listing_id: string

  source_url: string

}

export async function compareAgent(

  teamId: string,

  scannedListings: ScanListing[]

) {

  const {

    data: dbListings,

    error,

  } = await supabase

.from("listing_listings")
.select(
  "id, source_listing_id, source_url, listing_status"
)
.eq("team_id", teamId)
.eq("listing_status", "Active")

  if (error) {

    throw error

  }

  const scannedMap =

    new Map<

      string,

      ScanListing

    >()

  for (

    const listing of scannedListings

  ) {

    scannedMap.set(

      listing.source_listing_id,

      listing

    )

  }

  const dbMap =

    new Map<

      string,

      any

    >()

  for (

    const listing of

    dbListings || []

  ) {

    dbMap.set(

      listing.source_listing_id,

      listing

    )

  }

  const newListings:

    ScanListing[] = []

  const existingListings:

    ScanListing[] = []

  const removedListings:

    any[] = []

  // --------------------
  // 官网 → Compare
  // --------------------

  for (

    const listing of scannedListings

  ) {

    if (

      dbMap.has(

        listing.source_listing_id

      )

    ) {

      existingListings.push(

        listing

      )

    }

    else {

      newListings.push(

        listing

      )

    }

  }

  // --------------------
  // 数据库 → Compare
  // --------------------

  for (

    const listing of

    dbListings || []

  ) {

    if (

      !scannedMap.has(

        listing.source_listing_id

      )

    ) {

      removedListings.push(

        listing

      )

    }

  }

  return {

    newListings,

    existingListings,

    removedListings,

  }

}