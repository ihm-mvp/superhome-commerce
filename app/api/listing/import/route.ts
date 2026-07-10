// app/api/listing/import/route.ts

import { NextResponse } from "next/server"

import { supabase } from "@/lib/supabase"

import { importListing } from "@/lib/listing/importListing"

export async function POST(
  req: Request
) {

  try {

    console.log("=== ROUTE V6 ===")

    const {
      url,
      teamId,
    } = await req.json()

    if (!url || !teamId) {

      return NextResponse.json(
        {
          error:
            "URL is required.",
        },
        {
          status: 400,
        }
      )

    }

    console.log("STEP 0")

    const listing =
      await importListing(
        url
      )

    console.log("STEP 1")

    const {

      openHomes,

      ...listingRow

    }: any = listing

    console.log(
      "STEP 2",
      openHomes
    )

    listingRow.team_id =

teamId

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

    console.log(
      "STEP 3",
      savedListing,
      listingError
    )

    if (
      listingError
    ) {

      throw listingError

    }

    console.log(
      "STEP 4",
      openHomes?.length
    )

    if (
      openHomes?.length
    ) {

      console.log("STEP 5")

      const rows =
        openHomes.map(
          (o: any) => ({

            listing_id:
              savedListing.id,

            ...o,

          })
        )

      console.log(
        "ROWS",
        rows
      )

      const {
        error:
          openhomeError,
      } = await supabase
        .from(
          "listing_openhomes"
        )
        .insert(rows)

      console.log(
        "OPENHOME ERROR",
        openhomeError
      )

      if (
        openhomeError
      ) {

        throw openhomeError

      }

      console.log("STEP 6")

    }

    console.log("STEP 7")

    return NextResponse.json({

      success: true,

      id:
        savedListing.id,

    })

  } catch (error: any) {

    console.log(
      "CATCH",
      error
    )

    return NextResponse.json(

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