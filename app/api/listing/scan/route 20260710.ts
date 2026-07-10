import { NextResponse } from "next/server"

import { supabase } from "@/lib/supabase"

import { scanAgent } from "@/lib/listing/scanAgent"

export async function POST(
  req: Request
) {

  try {

    const {

      teamId,

    } = await req.json()

    if (

      !teamId

    ) {

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

    if (

      error

    ) {

      throw error

    }

    if (

      !team

    ) {

      throw new Error(

        "Team not found."

      )

    }

    if (

      !team.listing_index_url

    ) {

      throw new Error(

        "listing_index_url is empty."

      )

    }

    console.log(
      "========== SCAN AGENT =========="
    )

    console.log(
      "Team:",
      team.team_name
    )

    console.log(
      "URL:",
      team.listing_index_url
    )

    const listings =

      await scanAgent(

        team.listing_index_url

      )

    console.log(

      "Found Listings:",

      listings.length

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

      count:

        listings.length,

      listings,

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