import * as cheerio from "cheerio"

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
  floorArea: string | null
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

  const garage =
    getAttribute(attrs, "garage_parking") ??
    getAttribute(attrs, "parking")

  if (!garage) return null

  const m = garage.match(/\d+/)

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

function extractAgency($: cheerio.CheerioAPI) {

  let agentName = ""

  let agencyName = ""

  $("img").each((_, el) => {

    const alt = $(el).attr("alt")

    if (
      alt &&
      alt.length > 2 &&
      !agentName
    ) {
      agentName = alt.trim()
    }

  })

  $("body *").each((_, el) => {

    const text = $(el).text().trim()

    if (
      text.includes("Harcourts") ||
      text.includes("Ray White") ||
      text.includes("Harcourts Gold") ||
      text.includes("Bayleys") ||
      text.includes("Harcourts Holmwood")
    ) {

      agencyName = text

      return false

    }

  })

  return {
    agentName,
    agencyName
  }

}

function extractJson(html: string): any {

  const start =
    html.indexOf('"listing":{"cachedDetails"')

  if (start < 0)
    throw new Error("TradeMe listing JSON not found.")

  const end =
    html.indexOf('"marketingCollections"', start)

  if (end < 0)
    throw new Error("TradeMe JSON end not found.")

  const jsonText =
    "{"
    + html.substring(start, end - 1)
    + "}"

  return JSON.parse(jsonText)

}

export async function importTrademe(
  url: string
): Promise<TradeMeProperty> {

  const html = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0"
    }
  }).then(r => r.text())

  const $ = cheerio.load(html)

  const json = extractJson(html)

  const ids =
    json.listing.cachedDetails.ids

  const listingId = ids[0]

  const item =
    json.listing
      .cachedDetails
      .entities[listingId]
      .item

  const attrs =
    item.attributes ?? []

  const agency =
    extractAgency($)

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

  const tenure =
    getAttribute(attrs, "tenure")

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

    tenure,

    agentName:
      agency.agentName,

    agencyName:
      agency.agencyName,

    description,

    images,

    openHomes

  }

}