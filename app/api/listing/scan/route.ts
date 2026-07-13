import { NextResponse } from "next/server"

import { supabase } from "@/lib/supabase"

import { scanAgent } from "@/lib/listing/scanAgent"

import { compareAgent } from "@/lib/listing/compareAgent"

import { importListing } from "@/lib/listing/importListing"

import { scanExistingListings } from "@/lib/listing/scanExistingListings"

export async function POST(
  req: Request
) {

  try {

    const {

      teamId,

    } = await req.json()

    if (!teamId) {

      return NextResponse.json(

        {

          success: false,

          error: "Team ID is required.",

        },

        {

          status: 400,

        }

      )

    }

    const {

      data: team,

      error,

    } = await supabase

      .from("team_accounts")

      .select(

        "id, team_name, team_slug, listing_index_url"

      )

      .eq(

        "id",

        teamId

      )

      .single()

    if (error) {

      throw error

    }

    if (!team) {

      throw new Error(

        "Team not found."

      )

    }

    if (!team.listing_index_url) {

      throw new Error(

        "listing_index_url is empty."

      )

    }

    // ----------------------------------
    // S4-1 Scan Agent
    // ----------------------------------

    const scannedListings =

      await scanAgent(

        team.listing_index_url

      )

    // ----------------------------------
    // S4-2 Compare Agent
    // ----------------------------------

    const result =

      await compareAgent(

        team.id,

        scannedListings

      )

    // ----------------------------------
    // S4-2 Action
    // Removed → Inactive
    // ----------------------------------

    let removedUpdated = 0

    // ----------------------------------
// S4-3 Action
// Import New Listings
// ----------------------------------

let importedCount = 0

let failedCount = 0

let skippedCount = 0

const importedListings: any[] = []

const skippedListings: any[] = []

const failedListings: any[] = []

    if (

      result.removedListings.length > 0

    ) {

      const ids =

        result.removedListings.map(

          listing => listing.id

        )

      const {

        error: updateError,

      } = await supabase

        .from(

          "listing_listings"

        )

.update({

  listing_status:

    "Inactive",

  updated_at:

    new Date().toISOString(),

})

        .in(

          "id",

          ids

        )

      if (

        updateError

      ) {

        throw updateError

      }

      removedUpdated =

        ids.length

    }

for (

  const newListing of

  result.newListings

)

{

  try {

    const listing =

      await importListing(

        newListing.source_url

      )

      if (

  listing == null

) {

skippedCount++

skippedListings.push(
  newListing
)

continue

}

    const {

      openHomes,

      ...listingRow

    }: any = listing

    // listingRow.user_id =

  // "f274bb98-bf20-438b-b6f3-9ac4f875c26a"

    listingRow.team_id =

      team.id

    const {

      data: savedListing,

      error: listingError,

    } = await supabase

      .from(

        "listing_listings"

      )

      .insert(

        listingRow

      )

      .select("id")

      .single()

    if (

      listingError

    ) {

      throw listingError

    }

    if (

      openHomes?.length

    ) {

      const rows =

        openHomes.map(

          (o: any) => ({

            listing_id:

              savedListing.id,

            ...o,

          })

        )

      const {

        error:

          openhomeError,

      } = await supabase

        .from(

          "listing_openhomes"

        )

        .insert(

          rows

        )

      if (

        openhomeError

      ) {

        throw openhomeError

      }

    }

    importedCount++

    importedListings.push(
  newListing
)

  }

  catch (

    error: any

  ) {

    console.error(

      newListing.source_url,

      error

    )

failedCount++

failedListings.push({

  ...newListing,

  error:

    error instanceof Error

      ? error.message

      : String(error),

})

  }

}

const existingScan =

  await scanExistingListings(

    result.existingListings,

  )

    return NextResponse.json({

      success: true,

      team: {

        id:

          team.id,

        name:

          team.team_name,

        slug:

          team.team_slug,

      },

      listingIndexUrl:

        team.listing_index_url,

      scanCount:

        scannedListings.length,

      newCount:

        result.newListings.length,

      existingCount:

        result.existingListings.length,

      removedCount:

        result.removedListings.length,

      removedUpdated,

      importedCount,

      skippedCount,

      failedCount,

existingListings:

  result.existingListings,

removedListings:

  result.removedListings,

importedListings,

skippedListings,

failedListings,

existingScan,

    })

  }

  catch (

    error: any

  ) {

    console.error(

      error

    )

    return NextResponse.json(

      {

        success: false,

        error:

          error.message,

      },

      {

        status: 500,

      }

    )

  }

}