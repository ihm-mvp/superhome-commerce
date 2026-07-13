// lib/listing/compareListing.ts

import {

  listingComparePool,

} from "./comparePool"

export function compareListing(

  existingListing: any,

  existingOpenHomes: any[],

  parsedListing: any,

) {

  const listingChangedFields: string[] = []

  // -------------------------
  // Listing Compare
  // -------------------------

  for (

    const field of

    listingComparePool

  ) {

    if (

      existingListing[field] !==

      parsedListing[field]

    ) {

      listingChangedFields.push(

        field

      )

    }

  }

  // -------------------------
  // Open Home Compare
  // -------------------------

  const existingOpenHomeJson =

    JSON.stringify(

      [...existingOpenHomes]

        .map(

          home => ({

            openhome_date:

              home.openhome_date,

            start_time:

              home.start_time,

            end_time:

              home.end_time,

          })

        )

        .sort(

          (a, b) =>

            `${a.openhome_date}${a.start_time}`

              .localeCompare(

                `${b.openhome_date}${b.start_time}`

              )

        )

    )

  const parsedOpenHomeJson =

    JSON.stringify(

      [...(

        parsedListing.openHomes || []

      )]

        .sort(

          (a, b) =>

            `${a.openhome_date}${a.start_time}`

              .localeCompare(

                `${b.openhome_date}${b.start_time}`

              )

        )

    )

  const openHomeChanged =

    existingOpenHomeJson !==

    parsedOpenHomeJson

return {

  changed:

    listingChangedFields.length > 0 ||

    openHomeChanged,

  listingChanged:

    listingChangedFields.length > 0,

  listingChangedFields,

  openHomeChanged,

}

}