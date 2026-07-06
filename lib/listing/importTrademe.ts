export interface OpenHome {
  date: string
  start: string
  end: string
}

export interface TradeMeProperty {
  sourcePlatform: "TradeMe"
  sourceListingId: string
  sourceUrl: string

  address: string
  headline: string
  price: string
  listingStatus: "Active" | "Sold" | "Withdrawn"

  propertyType: string
  bedrooms: number
  bathrooms: number
  garages: number | null
  floorArea: string |null
  landArea: string | null
  tenure: string | null

  agentName: string
  agencyName: string

  description: string

  images: string[]

  openHomes: OpenHome[]
}

function getAttribute(
  attrs: any[],
  name: string
): string | null {

  const item = attrs.find(
    (a: any) => a.name === name
  )

  return item?.value ?? null

}

function numberOnly(value: string | null): number {

  if (!value) return 0

  const m = value.match(/\d+/)

  return m ? Number(m[0]) : 0

}

function parseGarage(attrs: any[]): number | null {

  const value =
    getAttribute(attrs, "garage_parking") ??
    getAttribute(attrs, "parking")

  if (!value) return null

  const m = value.match(/\d+/)

  return m ? Number(m[0]) : null

}

function extractImages(html: string): string[] {

  const images = new Set<string>()

  const regex =
    /https:\/\/trademe\.tmcdn\.co\.nz[^"' ]+\.(jpg|jpeg|png|webp)/gi

  let match

  while ((match = regex.exec(html)) !== null) {

    images.add(match[0])

  }

  return [...images]

}

function extractAgentName(html: string): string {

  const m =
    html.match(/alt="([^"]+)"/)

  return m?.[1] ?? ""

}

function extractAgencyName(html: string): string {

  const agencies = [

    "Harcourts Gold",

    "Harcourts",

    "Ray White",

    "Bayleys",

    "Holmwood",

    "Lugtons",

    "Property Brokers"

  ]

  for (const agency of agencies) {

    if (html.includes(agency)) {

      return agency

    }

  }

  return ""

}

function extractListingJson(html: string): any {

  const start =
    html.indexOf('"listing":{"cachedDetails"')

  if (start < 0) {

    throw new Error("Listing JSON not found.")

  }

  const end =
    html.indexOf('"marketingCollections"', start)

  if (end < 0) {

    throw new Error("Listing JSON end not found.")

  }

  const json =
    "{"
    + html.substring(start, end - 1)
    + "}"

  return JSON.parse(json)

}

export async function importTrademe(
  url: string
): Promise<TradeMeProperty> {

  const html = await fetch(url, {

    headers: {

      "User-Agent": "Mozilla/5.0"

    }

  }).then(r => r.text())

  const json =
    extractListingJson(html)

  const ids =
    json.listing.cachedDetails.ids

  const listingId =
    ids[0]

  const item =
    json
      .listing
      .cachedDetails
      .entities[listingId]
      .item

  const attrs =
    item.attributes ?? []

  const images =
    extractImages(html)
      const openHomes: OpenHome[] =
    (item.openHomes ?? []).map((o: any) => ({

      date:
        (o.date ?? "")
          .toString()
          .substring(0, 10),

      start:
        o.startTime ??
        o.start ??
        "",

      end:
        o.endTime ??
        o.end ??
        ""

    }))

  const description =
    item.body ??
    item.description ??
    item.marketingDescription ??
    ""

  return {

    sourcePlatform: "TradeMe",

    sourceListingId:
      String(item.listingId),

    sourceUrl: url,

    address:
      getAttribute(attrs, "location") ??
      "",

    headline:
      item.title ??
      "",

    price:
      item.priceDisplay ??
      getAttribute(attrs, "price") ??
      "",

    listingStatus:
      item.isSold
        ? "Sold"
        : "Active",

    propertyType:
      getAttribute(attrs, "property_type") ??
      "",

    bedrooms:
      numberOnly(
        getAttribute(attrs, "bedrooms")
      ),

    bathrooms:
      numberOnly(
        getAttribute(attrs, "bathrooms")
      ),

    garages:
      parseGarage(attrs),

    floorArea:
      getAttribute(attrs, "floor_area"),

    landArea:
      getAttribute(attrs, "land_area"),

    tenure:
      getAttribute(attrs, "tenure"),

    agentName:
      extractAgentName(html),

    agencyName:
      extractAgencyName(html),

    description,

    images,

    openHomes

  }

}