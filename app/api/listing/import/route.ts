// app/api/listing/import/route.ts

import { NextResponse } from "next/server"

import { supabase } from "@/lib/supabase"

import { importTrademe } from "@/lib/listing/importTrademe"

export async function POST(
  req: Request
) {

  try {

    const {
      url,
    } = await req.json()

    if (!url) {

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

    const listing =
      await importTrademe(
        url
      )

    const {

      openHomes,

      ...listingRow

    } = listing

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
        .insert(rows)

      if (
        openhomeError
      ) {

        throw openhomeError

      }

    }

    return NextResponse.json({

      success: true,

      id:
        savedListing.id,

    })

  } catch (error: any) {

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