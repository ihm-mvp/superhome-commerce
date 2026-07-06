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
        { success: false, message: "TradeMe URL is required." },
        { status: 400 }
      )
    }

    const property = await importTrademe(url)

    const { data: listing, error } = await supabase
      .from("listing_listings")
      .upsert(
        {
          source_platform: property.sourcePlatform,
          source_listing_id: property.sourceListingId,
          source_url: property.sourceUrl,
          address: property.address,
          headline: property.headline,
          price: property.price,
          listing_status: property.listingStatus,
          property_type: property.propertyType,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          garages: property.garages,
          floor_area: property.floorArea,
          land_area: property.landArea,
          tenure: property.tenure,
          agent_name: property.agentName,
          agency_name: property.agencyName,
          agent_phone: property.agentPhone,
          description: property.description,
          images: property.images
        },
        {
          onConflict: "source_listing_id"
        }
      )
      .select()
      .single()

    if (error) throw error

    const { error: deleteError } = await supabase
      .from("listing_openhomes")
      .delete()
      .eq("listing_id", listing.id)

    if (deleteError) throw deleteError

    if (property.openHomes.length > 0) {
      const { error: insertError } = await supabase
        .from("listing_openhomes")
        .insert(
          property.openHomes.map((o) => ({
            listing_id: listing.id,
            open_date: o.date,
            start_time: o.start,
            end_time: o.end
          }))
        )

      if (insertError) throw insertError
    }

    return NextResponse.json({
      success: true,
      listingId: listing.id
    })

  } catch (e: any) {
    return NextResponse.json(
      {
        success: false,
        message: e.message ?? "Import failed."
      },
      { status: 500 }
    )
  }
}