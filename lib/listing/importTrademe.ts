/**
 * lib/listing/importTrademe.ts
 *
 * PLACEHOLDER SCAFFOLD
 * This scaffold is generated from the confirmed TradeMe HTML structure
 * discussion and is intended as the project starting point.
 * Replace the parsing section with the final selectors as development continues.
 */

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
  agentPhone: string | null

  description: string

  images: string[]

  openHomes: OpenHome[]
}

export async function importTrademe(url: string): Promise<TradeMeProperty> {
  const html = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0"
    }
  }).then(r => r.text())

  // TODO:
  // Parse TradeMe HTML here using cheerio.
  // Extract:
  // - listing id
  // - address
  // - headline
  // - price
  // - bedrooms/bathrooms
  // - description
  // - images
  // - open homes
  // - agent info

  throw new Error("Parser implementation to be completed.")
}
