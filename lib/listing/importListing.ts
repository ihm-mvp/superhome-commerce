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
            "Mozilla/5.0",
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
  // Bedrooms
  // =====================================

  const bedroomMatch =
    description.match(

      /(\d+)\s+bedrooms/i

    )

  const bedrooms =
    bedroomMatch

      ? Number(
          bedroomMatch[1]
        )

      : null

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
  // Bathrooms
  // =====================================

  const bathroomMatch =
    html.match(

      /([0-9]+)\s*Bathrooms?/i

    )

  const bathrooms =
    bathroomMatch

      ? Number(
          bathroomMatch[1]
        )

      : null

  // =====================================
  // Garage
  // =====================================

  const garageMatch =
    html.match(

      /([0-9]+)\s*Garage/i

    )

  const garage =
    garageMatch

      ? Number(
          garageMatch[1]
        )

      : null

  // =====================================
  // Floor Area
  // =====================================

  const floorMatch =
    html.match(

      /([0-9]+m²)\s*Floor/i

    )

  const floorArea =
    floorMatch

      ? floorMatch[1]

      : ""

  // =====================================
  // Land Area
  // =====================================

  const landMatch =
    html.match(

      /([0-9]+m²)\s*Land/i

    )

  const landArea =
    landMatch

      ? landMatch[1]

      : ""
        // =====================================
  // Photos
  // =====================================

  const photos =
    extractAll(

      html,

      '"url":"',

      '"'

    ).filter(

      (p) =>

        p.includes(
          "cloudfront.net"
        ) ||

        p.includes(
          "resizer"
        ) ||

        p.includes(
          ".jpg"
        )

    )

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

  const agentName =
    extractBetween(

      html,

      '"agentName":"',

      '"'

    )

  const officeName =
    extractBetween(

      html,

      '"officeName":"',

      '"'

    )

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

const openHomeRegex =

  /"startDate":"([^"]+)"[\s\S]*?"endDate":"([^"]+)"/g

  let match

  while (

    (
      match =
        openHomeRegex.exec(
          html
        )
    ) !== null

  ) {

    openHomes.push({

      start_time:
        match[1],

      end_time:
        match[2],

      raw_json:
        match[0],

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

  return {

    source:
      "harcourts-gold",

    listing_id:
      listingId,

    trademe_id:
      null,

    title,

    address,

    canonical_path:
      url,

    price_display:
      priceDisplay,

    description,

    property_type:
      "House",

    bedrooms,

    bathrooms,

    garage,

    parking:
      garage,

    land_area:
      landArea,

    floor_area:
      floorArea,

    attributes:
      {},

    property_attributes:
      {},

    photos,

    floorplan_image:
      floorplanImage,

    video_url:
      videoUrl,

    agency_name:
      "Harcourts Gold",

    office_name:
      officeName,

    agent_name:
      agentName,

    latitude,

    longitude,

    suburb:
      null,

    city:
      null,

    district:
      null,

    region:
      null,

    openHomes,

  }

}