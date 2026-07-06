// lib/listing/types.ts

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

  propertyType: string

  price: string

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

  propertyJson: any

  listingStatus: "Active" | "Sold" | "Withdrawn"

}