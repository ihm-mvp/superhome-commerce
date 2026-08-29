// lib/listing/parser/parseHarcourtsIlam.ts
//
// Part 1/2

export async function parseHarcourtsIlam(
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

  console.log(
    "FETCH",
    url,
    response.status
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

  console.log(
    "HTML",
    url,
    html.length
  )

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

  function decodeHtml(
    value: string
  ) {

    return value
      .replace(
        /&#039;/g,
        "'"
      )
      .replace(
        /&quot;/g,
        '"'
      )
      .replace(
        /&amp;/g,
        "&"
      )
      .replace(
        /&lt;/g,
        "<"
      )
      .replace(
        /&gt;/g,
        ">"
      )

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

  const addressMatch =
    html.match(
      /<h1>\s*([^<]+?)\s*<\/h1>/i
    )

  const address =
    addressMatch
      ? decodeHtml(
          addressMatch[1].trim()
        )
      : ""

  // =====================================
  // Headline
  // =====================================

  const headlineMatch =
    html.match(
      /<h2 class="display-1">\s*([\s\S]*?)\s*<\/h2>/i
    )

  const headline =
    headlineMatch
      ? decodeHtml(
          headlineMatch[1]
            .replace(
              /<[^>]+>/g,
              ""
            )
            .trim()
        )
      : ""

  // =====================================
  // Price
  // =====================================

  const priceMatch =
    html.match(
      /<h3>\s*([^<]+?)\s*<\/h3>/i
    )

  const price =
    priceMatch
      ? decodeHtml(
          priceMatch[1].trim()
        )
      : ""

  // =====================================
  // Property Details
  // =====================================

  const bedMatch =
    html.match(
      /<li class="bed"><span>(\d+)<\/span>/i
    )

  const bathMatch =
    html.match(
      /<li class="bath"><span>(\d+)<\/span>/i
    )

  const garageMatch =
    html.match(
      /<li class="garage"><span>(\d+)<\/span>/i
    )

  const bedrooms =
    bedMatch
      ? Number(
          bedMatch[1]
        )
      : null

  const bathrooms =
    bathMatch
      ? Number(
          bathMatch[1]
        )
      : null

  const garages =
    garageMatch
      ? Number(
          garageMatch[1]
        )
      : null

  // =====================================
  // Land / Floor Area
  // =====================================

  const areaMatches =

    [
      ...html.matchAll(
        /<li class="square-meters-container">\s*<span>\s*(\d+)/g
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

  const seenPhotos =
    new Set<string>()

  const photoRegex =
    /data-src="(https:\/\/listings-photos\.cloudhi\.io\/properties\/[^"]+\/1448x912)"/g

  let photoMatch:
    RegExpExecArray | null

  while (
    (
      photoMatch =
        photoRegex.exec(
          html
        )
    ) !== null
  ) {

    const photo =
      photoMatch[1]

    if (
      seenPhotos.has(
        photo
      )
    ) {

      continue

    }

    seenPhotos.add(
      photo
    )

    photos.push(
      photo
    )

  }

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

  const phoneMatch =
    html.match(
      /href="tel:([^"]+)"/i
    )

  const agentPhone =
    phoneMatch
      ? phoneMatch[1].trim()
      : null

  // =====================================
  // Latitude / Longitude
  // =====================================

  const mapListingMatch =
    html.match(
      /var mapItemSearchResultsJSON = (\[[\s\S]*?\]);/
    )

  let latitude:
    number | null =
    null

  let longitude:
    number | null =
    null

  if (
    mapListingMatch
  ) {

    try {

      const mapListings =
        JSON.parse(
          mapListingMatch[1]
        )

      if (
        Array.isArray(
          mapListings
        ) &&
        mapListings.length > 0
      ) {

        const currentListing =
          mapListings.find(
            listing =>
              typeof listing?.url ===
                "string" &&
              listing.url.includes(
                "/listing/"
              )
          ) ||
          mapListings[0]

        const lat =
          Number(
            currentListing?.lat
          )

        const lng =
          Number(
            currentListing?.lng
          )

        latitude =
          Number.isFinite(
            lat
          )
            ? lat
            : null

        longitude =
          Number.isFinite(
            lng
          )
            ? lng
            : null

      }

    }

    catch (
      error
    ) {

      console.error(
        "MAP JSON PARSE FAILED",
        error
      )

    }

  }
  // =====================================
// Open Homes
// =====================================

const openHomes: any[] = []

const seenOpenHomes =
  new Set<string>()

const openHomeRegex =
  /href="data:text\/calendar;charset=utf8;base64,([^"]+)"/g

const openHomeMatches =
  [
    ...html.matchAll(
      openHomeRegex
    ),
  ]

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
        part =>
          part.type === type
      )?.value || ""

  return {

    date:
      `${get("year")}-${get("month")}-${get("day")}`,

    time:
      `${get("hour")}:${get("minute")}:${get("second")}`,

  }

}

for (
  const match of
  openHomeMatches
) {

  const ics =
    Buffer
      .from(
        match[1],
        "base64"
      )
      .toString(
        "utf8"
      )

  const uid =
    ics.match(
      /UID:([^\r\n]+)/
    )?.[1]

  if (
    !uid ||
    seenOpenHomes.has(
      uid
    )
  ) {

    continue

  }

  const summary =
    ics.match(
      /SUMMARY:([^\r\n]+)/
    )?.[1] || ""

  if (
    !/open\s*home/i.test(
      summary
    )
  ) {

    continue

  }

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

  seenOpenHomes.add(
    uid
  )

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
      startNz.date,

    start_time:
      startNz.time,

    end_time:
      endNz.time,

  })

}

// =====================================
// Auctions
// =====================================

const auctions: any[] = []

const seenAuctions =
  new Set<string>()

for (
  const match of
  openHomeMatches
) {

  const ics =
    Buffer
      .from(
        match[1],
        "base64"
      )
      .toString(
        "utf8"
      )

  const uid =
    ics.match(
      /UID:([^\r\n]+)/
    )?.[1]

  const summary =
    ics.match(
      /SUMMARY:([^\r\n]+)/
    )?.[1] || ""

  if (
    !uid ||
    !/auction/i.test(
      summary
    )
  ) {

    continue

  }

  const start =
    ics.match(
      /DTSTART:(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/
    )

  const end =
    ics.match(
      /DTEND:(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/
    )

  if (
    !start
  ) {

    continue

  }

  const key =
    `${uid}-${start[1]}${start[2]}${start[3]}-${start[4]}${start[5]}`

  if (
    seenAuctions.has(
      key
    )
  ) {

    continue

  }

  seenAuctions.add(
    key
  )

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

  const startNz =
    toNzParts(
      startUtc
    )

  let endTime:
    string | null =
    null

  if (
    end
  ) {

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

    endTime =
      toNzParts(
        endUtc
      ).time

  }

  const location =
    ics.match(
      /LOCATION:([^\r\n]+)/
    )?.[1]
      ?.replace(
        /\\n/g,
        ", "
      )
      .trim() ||
    null

  auctions.push({

    auction_date:
      startNz.date,

    start_time:
      startNz.time,

    end_time:
      endTime,

    venue:
      location,

  })

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
// Listing ID
// =====================================

const listingIdMatch =
  url.match(
    /\/listing\/([^/?#]+)/
  )

const listingId =
  listingIdMatch
    ? listingIdMatch[1]
    : null

// =====================================
// Return
// =====================================

console.log(
  "PARSE OK",
  address
)

return {

  source_platform:
    "Harcourts Ilam",

  source_listing_id:
    listingId,

  source_url:
    url,

  address,

  headline:
    headline || title,

  price,

  bedrooms,

  bathrooms,

  garages,

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

  agent_phone:
    agentPhone,

  trademe_description:
    description,

  listing_status:
    "Active",

  openHomes,

  auctions,

  property_json: {

    source:
      "harcourts-ilam",

    title,

    description,

    og_image:
      ogImage,

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

}

}