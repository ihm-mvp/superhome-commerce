import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { importTrademe } from "@/lib/listing/importTrademe"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  try {

    const { url } = await req.json()

    if (!url) {
      return NextResponse.json(
        {
          success: false,
          message: "TradeMe URL is required."
        },
        {
          status: 400
        }
      )
    }

    // ===== Import TradeMe =====

    const property = await importTrademe(url)

    // ===== TODO =====
    // Replace with current MIR logged-in user.
    // Temporary MVP user.
    const USER_ID = "f274bb98-bf20-438b-b6f3-9ac4f875c26a"

    // ===== Upsert Listing =====

    const { data: listing, error } = await supabase
      .from("listing_listings")
      .upsert(
        {
          user_id: USER_ID,

          source_platform: property.sourcePlatform,
          source_listing_id: property.sourceListingId,
          source_url: property.sourceUrl,

          address: property.address,
          headline: property.headline,

          property_type: property.propertyType,

          price: property.price,

          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          garages: property.garages,

          floor_area: property.floorArea,
          land_area: property.landArea,

          tenure: property.tenure,

          agent_name: property.agentName,
          agency_name: property.agencyName,

          trademe_description: property.description,

          listing_status: property.listingStatus,

          property_json: {
            images: property.images
          },

          updated_at: new Date().toISOString()
        },
        {
          onConflict:
            "source_platform,source_listing_id"
        }
      )
      .select()
      .single()

    if (error) {

      return NextResponse.json(
        {
          success: false,
          message: error.message
        },
        {
          status: 500
        }
      )

    }

    // ===== Refresh Open Homes =====

    const { error: deleteError } =
      await supabase
        .from("listing_openhomes")
        .delete()
        .eq("listing_id", listing.id)

    if (deleteError) {

      return NextResponse.json(
        {
          success: false,
          message: deleteError.message
        },
        {
          status: 500
        }
      )

    }

    if (property.openHomes.length > 0) {

      const rows =
        property.openHomes.map(home => ({

          listing_id: listing.id,

          openhome_date: home.date,

          start_time: home.start,

          end_time: home.end,

          status: "Active",

          updated_at: new Date().toISOString()

        }))

      const { error: insertError } =
        await supabase
          .from("listing_openhomes")
          .insert(rows)

      if (insertError) {

        return NextResponse.json(
          {
            success: false,
            message: insertError.message
          },
          {
            status: 500
          }
        )

      }

    }

    return NextResponse.json({

      success: true,

      listingId: listing.id,

      message: "Listing imported successfully."

    })

  } catch (e: any) {

    return NextResponse.json(
      {
        success: false,
        message:
          e?.message ??
          "Import failed."
      },
      {
        status: 500
      }
    )

  }

}