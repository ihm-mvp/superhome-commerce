// lib/listing/mapTrademe.ts

import { TradeMeProperty, OpenHome } from "./types"

function getAttribute(
  attributes: any[],
  name: string
): string | null {

  const item = attributes.find(
    (a) => a.name === name
  )

  return item?.value ?? null

}

function getNumber(
  attributes: any[],
  name: string
): number {

  const value = getAttribute(attributes, name)

  if (!value) return 0

  const match = value.match(/\d+/)

  return match ? Number(match[0]) : 0

}

function getGarage(
  attributes: any[]
): number | null {

  const value =
    getAttribute(attributes, "garage_parking") ??
    getAttribute(attributes, "parking")

  if (!value) return null

  const match = value.match(/\d+/)

  return match ? Number(match[0]) : null

}

function mapOpenHomes(
  item: any
): OpenHome[] {

  if (!item.openHomes) return []

  return item.openHomes.map((o: any) => ({

    date:
      (o.date ?? "")
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

}

export function mapTrademe(
  item: any,
  url: string
): TradeMeProperty {

  const attributes =
    item.attributes ?? []

  return {

    sourcePlatform: "TradeMe",

    sourceListingId:
      String(item.listingId),

    sourceUrl:
      url,

    address:
      item.address ?? "",

    headline:
      item.title ?? "",

    propertyType:
      getAttribute(
        attributes,
        "property_type"
      ) ?? "",

    price:
      item.priceDisplay ??
      item.displayPrice ??
      "",

    bedrooms:
      getNumber(
        attributes,
        "bedrooms"
      ),

    bathrooms:
      getNumber(
        attributes,
        "bathrooms"
      ),

    garages:
      getGarage(attributes),

    floorArea:
      getAttribute(
        attributes,
        "floor_area"
      ),

    landArea:
      getAttribute(
        attributes,
        "land_area"
      ),

    tenure:
      getAttribute(
        attributes,
        "tenure"
      ),

    agentName:
      item.agent?.name ??
      item.seller?.name ??
      "",

    agencyName:
      item.agent?.agency ??
      item.seller?.agency ??
      "",

    description:
      item.body ??
      item.description ??
      item.marketingDescription ??
      "",

    images:
      item.images ?? [],

    openHomes:
      mapOpenHomes(item),

    propertyJson:
      item,

    listingStatus:
      item.isSold
        ? "Sold"
        : "Active"

  }

}