import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

import { importTrademe } from "@/lib/listing/importTrademe"

const supabase = createClient(

  process.env.NEXT_PUBLIC_SUPABASE_URL!,

  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

)

// 临时固定用户
// 登录完成后改为当前登录用户ID

const USER_ID =
  "f274bb98-bf20-438b-b6f3-9ac4f875c26a"

export async function POST(
  req: NextRequest
) {

  try {

    const { url } =
      await req.json()

    if (!url) {

      return NextResponse.json({

        success: false,

        message: "TradeMe URL is required."

      }, {

        status: 400

      })

    }

    const property =
      await importTrademe(url)

    const {

      data: listing,

      error: listingError

    } = await supabase

      .from("listing_listings")

      .upsert({

        user_id:
          USER_ID,

        source_platform:
          property.sourcePlatform,

        source_listing_id:
          property.sourceListingId,

        source_url:
          property.sourceUrl,

        address:
          property.address,

        headline:
          property.headline,

        property_type:
          property.propertyType,

        price:
          property.price,

        bedrooms:
          property.bedrooms,

        bathrooms:
          property.bathrooms,

        garages:
          property.garages,

        floor_area:
          property.floorArea,

        land_area:
          property.landArea,

        tenure:
          property.tenure,

        agent_name:
          property.agentName,

        agency_name:
          property.agencyName,

        trademe_description:
          property.description,

        listing_status:
          property.listingStatus,

        property_json:
          property.propertyJson

      }, {

        onConflict:
          "source_platform,source_listing_id"

      })

      .select()

      .single()

    if (listingError)
      throw listingError

    const {

      error: deleteError

    } = await supabase

      .from("listing_openhomes")

      .delete()

      .eq(

        "listing_id",

        listing.id

      )

    if (deleteError)
      throw deleteError

    if (
      property.openHomes.length > 0
    ) {

      const rows =

        property.openHomes.map(

          (o) => ({

            listing_id:
              listing.id,

            openhome_date:
              o.date,

            start_time:
              o.start,

            end_time:
              o.end

          })

        )

      const {

        error: openhomeError

      } = await supabase

        .from(
          "listing_openhomes"
        )

        .insert(rows)

      if (openhomeError)
        throw openhomeError

    }

    return NextResponse.json({

      success: true,

      listingId:
        listing.id,

      message:
        "Listing imported successfully."

    })

  }

  catch (e: any) {

    return NextResponse.json({

      success: false,

      message:

        e.message ??

        "Import failed."

    }, {

      status: 500

    })

  }

}