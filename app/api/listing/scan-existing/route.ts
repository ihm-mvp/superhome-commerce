import {

  NextRequest,

  NextResponse,

} from "next/server"

import {

  parseHarcourtsGold,

} from "@/lib/listing/parser/parseHarcourtsGold"

export async function POST(

  request: NextRequest,

) {

  const {

    existingListings,

  } = await request.json()

  if (

    !existingListings ||

    existingListings.length === 0

  ) {

    return NextResponse.json({

      success: true,

      parsedListing: null,

    })

  }

  const parsedListing =

    await parseHarcourtsGold(

      existingListings[0].source_url

    )

  return NextResponse.json({

    success: true,

    parsedListing,

  })

}