// lib/listing/importListing.ts

import { generateMarketingAssets } from "@/lib/listing/ai/generateMarketingAssets"

import { generateQrCode } from "@/lib/listing/generateQrCode"

import { validatePropertyType } from "@/lib/listing/validateResidentialListingType TEMP"

import {
  parseHarcourtsGold,
} from "@/lib/listing/parser/parseHarcourtsGold"

export async function importListing(
  url: string
) {

  if (
    url.includes(
      "harcourtsgold.co.nz"
    )
  ) {

    return await parseHarcourtsGold(
      url
    )

  }

  throw new Error(
    "Unsupported listing source."
  )

}

async function parseHarcourtsGoldOld(
  url: string
) {

  // =====================================
  // Fetch HTML
  // =====================================

const response =
  await fetch(
    url,
    {
      headers: {

        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",

        "Accept":
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",

        "Accept-Language":
          "en-NZ,en;q=0.9",

        "Referer":
          "https://www.google.com/",

      },
    }
  )

if (
  !response.ok
) {

  throw new Error(

    `${response.status} ${response.statusText}`

  )

}

  const html =
    await response.text()

  // =====================================
  // Helpers
  // =====================================

  function extractBetween(

    source: string,

    start: string,

    end: string

  ) {

    const s =
      source.indexOf(
        start
      )

    if (
      s === -1
    ) {

      return ""

    }

    const from =
      s +
      start.length

    const e =
      source.indexOf(
        end,
        from
      )

    if (
      e === -1
    ) {

      return ""

    }

    return source
      .substring(
        from,
        e
      )
      .trim()

  }

  function extractAll(

    source: string,

    start: string,

    end: string

  ) {

    const results: string[] = []

    let index = 0

    while (true) {

      const s =
        source.indexOf(
          start,
          index
        )

      if (
        s === -1
      ) {

        break

      }

      const from =
        s +
        start.length

      const e =
        source.indexOf(
          end,
          from
        )

      if (
        e === -1
      ) {

        break

      }

      results.push(

        source
          .substring(
            from,
            e
          )
          .trim()

      )

      index =
        e +
        end.length

    }

    return results

  }

  // =====================================
  // Meta
  // =====================================

  const title =
    extractBetween(

      html,

      "<title>",

      "</title>"

    )

    // =====================================
// Property Type Validation
// =====================================

const {

  property_type,

  supported,

} = validatePropertyType(

  title

)

if (

  !supported

) {

  console.log(

    "SKIPPED"

  )

  return null

}

  const description =
    extractBetween(

      html,

      '<meta name="description" content="',

      '"'

    )

  const ogImage =
    extractBetween(

      html,

      '<meta property="og:image" content="',

      '"'

    )

  // =====================================
  // Address
  // =====================================

  let address = ""

  if (
    title.includes(
      " - House"
    )
  ) {

    address =
      title.split(
        " - House"
      )[0]

  } else {

    address = title

  }


  // =====================================
  // Price
  // =====================================

  const priceMatch =
    description.match(

      /Priced\s+\$([0-9,]+)/i

    )

  const priceDisplay =
    priceMatch

      ? "$" +
        priceMatch[1]

      : ""

// =====================================
// Property Details
// =====================================

const bedMatch =

  html.match(

    /<li class="bed">\s*<span>(\d+)<\/span>/i

  )

const bathMatch =

  html.match(

    /<li class="bath">\s*<span>(\d+)<\/span>/i

  )

const garageMatch =

  html.match(

    /<li class="garage">\s*<span>(\d+)<\/span>/i

  )

const bedrooms =

  bedMatch

    ? Number(bedMatch[1])

    : null

const bathrooms =

  bathMatch

    ? Number(bathMatch[1])

    : null

const garage =

  garageMatch

    ? Number(garageMatch[1])

    : null

// =====================================
// Floor / Land Area
// =====================================

const areaMatches = [

  ...html.matchAll(

    /<li class="square-meters-container">[\s\S]*?<span>\s*(\d+)/g

  ),

]

const landArea =

  areaMatches.length > 0

    ? areaMatches[0][1]

    : null

const floorArea =

  areaMatches.length > 1

    ? areaMatches[1][1]

    : null

      // =====================================
// Photos
// =====================================

const photos: string[] = []

const photoRegex =

  /data-src="(https:\/\/listings-photos[^"]+\/1448x912)"/g

let photoMatch

while (

  (photoMatch = photoRegex.exec(html))

  !== null

) {

  photos.push(

    photoMatch[1]

  )

}

  // =====================================
  // Floor Plan
  // =====================================

  const floorplanImage =
    extractBetween(

      html,

      '"floorplan":"',

      '"'

    )

  // =====================================
  // Video
  // =====================================

  const videoUrl =
    extractBetween(

      html,

      '"videoUrl":"',

      '"'

    )

// =====================================
// Agent
// =====================================

const agentMatch =

  html.match(

    /<p class="agent-name">\s*([^<]+)\s*<\/p>/i

  )

const agentName =

  agentMatch

    ? agentMatch[1].trim()

    : null

const officeMatch =

  html.match(

    /<p class="agent-office">\s*([^<]+)\s*<\/p>/i

  )

const officeName =

  officeMatch

    ? officeMatch[1].trim()

    : null

  // =====================================
  // Latitude / Longitude
  // =====================================

  const latitudeMatch =
    html.match(

      /"latitude":(-?[0-9.]+)/

    )

  const longitudeMatch =
    html.match(

      /"longitude":(-?[0-9.]+)/

    )

  const latitude =
    latitudeMatch
      ? Number(
          latitudeMatch[1]
        )
      : null

  const longitude =
    longitudeMatch
      ? Number(
          longitudeMatch[1]
        )
      : null

// =====================================
// Open Homes
// =====================================

const openHomes: any[] = []

const seen = new Set<string>()

const hrefRegex =

  /href="data:text\/calendar;charset=utf8;base64,([^"]+)"/g

const hrefMatches =

  [...html.matchAll(hrefRegex)]

const nzFormatter =

  new Intl.DateTimeFormat(

    "en-CA",

    {

      timeZone:

        "Pacific/Auckland",

      year:

        "numeric",

      month:

        "2-digit",

      day:

        "2-digit",

      hour:

        "2-digit",

      minute:

        "2-digit",

      second:

        "2-digit",

      hourCycle:

        "h23",

    }

  )

function toNzParts(
  date: Date
) {

  const parts =

    nzFormatter.formatToParts(
      date
    )

  const get =

    (
      type: string
    ) =>

      parts.find(
        p =>
          p.type === type
      )?.value || ""

  return {

    openhome_date:

      `${get("year")}-${get("month")}-${get("day")}`,

    time:

      `${get("hour")}:${get("minute")}:${get("second")}`,

  }

}

for (const match of hrefMatches) {

  const ics =

    Buffer
      .from(
        match[1],
        "base64"
      )
      .toString("utf8")

  const uid =

    ics.match(
      /UID:([^\r\n]+)/
    )?.[1]

  if (

    !uid ||

    seen.has(uid)

  ) {

    continue

  }

  seen.add(uid)

  const start =

    ics.match(

      /DTSTART:(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/

    )

  const end =

    ics.match(

      /DTEND:(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/

    )

  if (

    !start ||

    !end

  ) {

    continue

  }

  const startUtc =

    new Date(

      Date.UTC(

        Number(start[1]),

        Number(start[2]) - 1,

        Number(start[3]),

        Number(start[4]),

        Number(start[5]),

        Number(start[6])

      )

    )

  const endUtc =

    new Date(

      Date.UTC(

        Number(end[1]),

        Number(end[2]) - 1,

        Number(end[3]),

        Number(end[4]),

        Number(end[5]),

        Number(end[6])

      )

    )

  const startNz =

    toNzParts(
      startUtc
    )

  const endNz =

    toNzParts(
      endUtc
    )

  openHomes.push({

    openhome_date:

      startNz.openhome_date,

    start_time:

      startNz.time,

    end_time:

      endNz.time,

  })

}

  // =====================================
  // Listing Id
  // =====================================

  const listingIdMatch =
    url.match(

      /listing\/([^/?]+)/

    )

  const listingId =
    listingIdMatch
      ? listingIdMatch[1]
      : null

  // =====================================
  // Return
  // =====================================

console.log(hrefMatches)

const {

  ai_content,

} = await generateMarketingAssets({

    address,

    headline: title,

    trademe_description:
      description,

    property_type,

    price:
      priceDisplay,

    bedrooms,

    bathrooms,

    garages:
      garage,

    floor_area:
      floorArea,

    land_area:
      landArea,

    openHomes,

  })

const slug =

  address

    .toLowerCase()

    .replace(/\//g, "-")

    .replace(/,/g, "")

    .replace(/\./g, "")

    .replace(/\s+/g, "-")

    .replace(/-+/g, "-")

    .replace(/^-|-$/g, "")

    .replace(/[^a-z0-9-]/g, "")

const {

  qrcode_url,

} = await generateQrCode(
  slug
)

    return {

  source_platform:
    "Harcourts Gold",

  source_listing_id:
    listingId,

  source_url:
    url,

  slug,

  qrcode_url,

    address,

  headline:
    title,

  price:
    priceDisplay,

  bedrooms,

  bathrooms,

  garages:
    garage,

  floor_area:
    floorArea,

  land_area:
    landArea,

  tenure:
    null,

  agent_name:
    agentName,

  agency_name:
    officeName,

  trademe_description:
    description,

  listing_status:
    "Active",

  // ⭐ 新增，放到顶层
  openHomes,

  property_json: {

    source:
      "harcourts-gold",

    title,

    description,

    photos,

    floorplan_image:
      floorplanImage,

    video_url:
      videoUrl,

    office_name:
      officeName,

    latitude,

    longitude,

  },

  ai_content,

}

}