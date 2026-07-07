// lib/listing/importListing.ts

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

async function parseHarcourtsGold(
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

  openHomes.push({

    openhome_date:

      `${start[1]}-${start[2]}-${start[3]}`,

    start_time:

      `${start[4]}:${start[5]}:${start[6]}`,

    end_time:

      `${end[4]}:${end[5]}:${end[6]}`,

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
  
return {

  source_platform:
    "Harcourts Gold",

  source_listing_id:
    listingId,

  source_url:
    url,

  address,

  headline:
    title,

  property_type:
    "House",

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
    agentName,

  trademe_description:
    description,

  listing_status:
    "Active",

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

    openHomes,

  },

}

}