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

export async function importTrademe(
  url: string
): Promise<TradeMeProperty> {

  const listingId =
    url.match(/listing\/(\d+)/)?.[1] ??
    crypto.randomUUID()

  return {
    sourcePlatform: "TradeMe",

    sourceListingId: listingId,

    sourceUrl: url,

    address: "",

    headline: "",

    price: "",

    listingStatus: "Active",

    propertyType: "",

    bedrooms: 0,

    bathrooms: 0,

    garages: null,

    floorArea: null,

    landArea: null,

    tenure: null,

    agentName: "",

    agencyName: "",

    agentPhone: null,

    description: "",

    images: [],

    openHomes: []
  }
}