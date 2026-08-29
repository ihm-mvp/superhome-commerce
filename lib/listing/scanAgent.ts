// lib/listing/scanAgent.ts

export type AgentListing = {
  source_listing_id: string
  source_url: string
}

export async function scanAgent(
  listingIndexUrl: string
): Promise<AgentListing[]> {

  const origin =
    new URL(
      listingIndexUrl
    ).origin

  const html =
    await fetchHtml(
      listingIndexUrl
    )

  if (
    origin.includes(
      "harcourtsgold.co.nz"
    )
  ) {

    return scanHarcourtsGold(
      listingIndexUrl,
      origin,
      html
    )

  }

  if (
    origin.includes(
      "harcourts.net"
    )
  ) {

    return scanHarcourtsIlam(
      origin,
      html
    )

  }

  throw new Error(
    "Unsupported listing source."
  )

}

async function fetchHtml(
  url: string
): Promise<string> {

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
      `Failed to scan Agent page (${response.status})`
    )

  }

  return await response.text()

}

// =====================================
// Harcourts Gold
// Existing verified logic
// =====================================

async function scanHarcourtsGold(
  listingIndexUrl: string,
  origin: string,
  firstHtml: string
): Promise<AgentListing[]> {

  const listings: AgentListing[] = []

  const seen =
    new Set<string>()

  const totalPages =
    getTotalPages(
      firstHtml
    )

  extractGoldListings(
    firstHtml,
    origin,
    listings,
    seen
  )

  for (
    let page = 2;
    page <= totalPages;
    page++
  ) {

    const pageUrl =
      `${listingIndexUrl}&page=${page}`

    const html =
      await fetchHtml(
        pageUrl
      )

    extractGoldListings(
      html,
      origin,
      listings,
      seen
    )

  }

  return listings

}

function getTotalPages(
  html: string
): number {

  const pages =

    [
      ...html.matchAll(
        /page=(\d+)/g
      ),
    ].map(
      m => Number(m[1])
    )

  if (
    pages.length === 0
  ) {

    return 1

  }

  return Math.max(
    ...pages
  )

}

function extractGoldListings(
  html: string,
  origin: string,
  listings: AgentListing[],
  seen: Set<string>
) {

  const regex =
    /href="(\/listing\/([^"]+))"/g

  let match:
    RegExpExecArray | null

  while (
    (match = regex.exec(html))
    !== null
  ) {

    const relativeUrl =
      match[1]

    const listingId =
      match[2]

    if (
      seen.has(
        listingId
      )
    ) {

      continue

    }

    seen.add(
      listingId
    )

    listings.push({

      source_listing_id:
        listingId,

      source_url:
        origin +
        relativeUrl,

    })

  }

}

// =====================================
// Harcourts Ilam
// Don Yee MVP
// Current scope: one Agent / one Listing
// No pagination
// =====================================

function scanHarcourtsIlam(
  origin: string,
  html: string
): AgentListing[] {

  const listings: AgentListing[] = []

  const seen =
    new Set<string>()

  const regex =
    /href="(\/nz\/office\/ilam\/listing\/(l\d+)(?:-[^"]*)?)"/g

  let match:
    RegExpExecArray | null

  while (
    (match = regex.exec(html))
    !== null
  ) {

    const relativeUrl =
      match[1]

    const listingId =
      match[2]

    if (
      seen.has(
        listingId
      )
    ) {

      continue

    }

    seen.add(
      listingId
    )

    listings.push({

      source_listing_id:
        listingId,

      source_url:
        origin +
        relativeUrl,

    })

  }

  return listings

}