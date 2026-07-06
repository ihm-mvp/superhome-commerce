// lib/listing/importTrademe.ts

import { mapTrademe } from "./mapTrademe"
import { TradeMeProperty } from "./types"

function extractInitialState(html: string): any {

  const patterns = [

    "window.__INITIAL_STATE__=",

    "window.__INITIAL_STATE__ =",

    "__INITIAL_STATE__=",

    "__INITIAL_STATE__ ="

  ]

  let start = -1

  for (const p of patterns) {

    start = html.indexOf(p)

    if (start >= 0) {

      start += p.length
      break

    }

  }

  if (start < 0) {

    throw new Error("TradeMe initial state not found.")

  }

  while (

    html[start] === " " ||
    html[start] === "\n" ||
    html[start] === "\r"

  ) {

    start++

  }

  if (html[start] !== "{") {

    throw new Error("Initial state JSON not found.")

  }

  let depth = 0
  let inString = false
  let escaped = false
  let end = -1

  for (let i = start; i < html.length; i++) {

    const c = html[i]

    if (escaped) {

      escaped = false
      continue

    }

    if (c === "\\") {

      escaped = true
      continue

    }

    if (c === "\"") {

      inString = !inString
      continue

    }

    if (inString) {

      continue

    }

    if (c === "{") {

      depth++

    }

    else if (c === "}") {

      depth--

      if (depth === 0) {

        end = i
        break

      }

    }

  }

  if (end < 0) {

    throw new Error("Initial state JSON incomplete.")

  }

  return JSON.parse(

    html.substring(
      start,
      end + 1
    )

  )

}

function findCachedDetails(
  state: any
): any {

  if (
    state?.listing?.cachedDetails
  ) {

    return state.listing.cachedDetails

  }

  throw new Error(
    "listing.cachedDetails not found."
  )

}

function firstListing(
  cachedDetails: any
): any {

  const ids =
    cachedDetails.ids ?? []

  if (ids.length === 0) {

    throw new Error(
      "No listing found."
    )

  }

  const entity =

    cachedDetails.entities?.[
      ids[0]
    ]

  if (!entity?.item) {

    throw new Error(
      "Listing entity missing."
    )

  }

  return entity.item

}

export async function importTrademe(

  url: string

): Promise<TradeMeProperty> {

  const response =
    await fetch(url, {

      headers: {

        "User-Agent":
          "Mozilla/5.0"

      }

    })

  if (!response.ok) {

    throw new Error(
      "Unable to download TradeMe page."
    )

  }

  const html =
    await response.text()
      const state =
    extractInitialState(html)

  const cachedDetails =
    findCachedDetails(state)

  const item =
    firstListing(cachedDetails)

  const property =
    mapTrademe(
      item,
      url
    )

  return {

    ...property,

    propertyJson:
      cachedDetails

  }

}