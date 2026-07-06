// lib/listing/importTrademe.ts

export async function importTrademe(
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

  if (!response.ok) {

    throw new Error(
      "Unable to fetch TradeMe page."
    )

  }

  const html =
    await response.text()

  // =====================================
  // Extract frend-state JSON
  // =====================================

  const scriptStart =
    html.indexOf(
      '<script id="frend-state"'
    )

  if (
    scriptStart === -1
  ) {

    throw new Error(
      "frend-state not found."
    )

  }

  const jsonStart =
    html.indexOf(
      ">",
      scriptStart
    ) + 1

  const jsonEnd =
    html.indexOf(
      "</script>",
      jsonStart
    )

  if (
    jsonEnd === -1
  ) {

    throw new Error(
      "frend-state end tag not found."
    )

  }

  const jsonString =
    html
      .substring(
        jsonStart,
        jsonEnd
      )
      .trim()

  // =====================================
  // Parse JSON
  // =====================================

  let state: any

  try {

    state =
      JSON.parse(
        jsonString
      )

  } catch {

    throw new Error(
      "Unable to parse frend-state JSON."
    )

  }

  // =====================================
  // Locate Listing
  // =====================================

  const ngrx =
    state?.NGRX_STATE

  if (!ngrx) {

    throw new Error(
      "NGRX_STATE not found."
    )

  }

  const cachedDetails =
    ngrx
      ?.listing
      ?.cachedDetails

  if (
    !cachedDetails
  ) {

throw new Error(

  JSON.stringify(

    Object.keys(

      ngrx.listing || {}

    )

  )

)

  }

  const ids =
    cachedDetails.ids

  const entities =
    cachedDetails.entities

  if (
    !ids?.length
  ) {

    throw new Error(
      "Listing ids not found."
    )

  }

  const item =
    entities[
      ids[0]
    ]

  if (!item) {

    throw new Error(
      "Listing entity not found."
    )

  }
    // =====================================
  // Property Information
  // =====================================

  const info =
    item.propertyListingInfo || {}

  const attrs =
    item.attributes || {}

  const propertyAttrs =
    item.propertyAttributes || {}

  const geo =
    item.geographicLocation || {}

  const agency =
    item.agency || {}

  const office =
    item.office || {}

  const member =
    item.member || {}

  // =====================================
  // Photos
  // =====================================

  const photos =
    (item.photos || [])
      .map(
        (p: any) =>
          p.url ||
          p.large ||
          p.medium ||
          p.thumbnail
      )
      .filter(Boolean)

  // =====================================
  // Open Homes
  // =====================================

  const openHomes =
    (item.openHomes || []).map(
      (o: any) => ({

        start_time:
          o.startDateTime ||

          o.start ||

          null,

        end_time:
          o.endDateTime ||

          o.end ||

          null,

        raw_json:
          o,

      })
    )

  // =====================================
  // Listing Object
  // =====================================

  const listing = {

    trademe_id:
      item.listingId,

    title:
      item.title,

    description:
      item.body,

    canonical_path:
      item.canonicalPath,

    price_display:
      item.priceDisplay,

    property_type:
      info.propertyType,

    bedrooms:
      info.bedrooms,

    bathrooms:
      info.bathrooms,

    parking:
      info.parking,

    land_area:
      info.landArea,

    floor_area:
      info.floorArea,

    attributes:
      attrs,

    property_attributes:
      propertyAttrs,

    photos,

    agency_name:
      agency.name,

    office_name:
      office.name,

    agent_name:
      member.displayName,

    latitude:
      geo.latitude,

    longitude:
      geo.longitude,

    suburb:
      geo.suburb,

    city:
      geo.city,

    district:
      geo.district,

    region:
      geo.region,

    openHomes,

  }
    // =====================================
  // Return
  // =====================================

return {

  debug:

    Object.keys(

      ngrx

    )

}

}