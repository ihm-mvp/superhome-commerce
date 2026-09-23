"use client"

import {
  useEffect,
} from "react"

type Props = {
  packageId: string
  leadSource: string
}

export default function PackageViewTracker({
  packageId,
  leadSource,
}: Props) {

  useEffect(() => {

    let visitorId =
      localStorage.getItem(
        "mir_visitor_id"
      )

    if (!visitorId) {

      visitorId =
        crypto.randomUUID()

      localStorage.setItem(
        "mir_visitor_id",
        visitorId
      )

    }

    fetch(
      "/api/package-view",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify({
            package_id:
              packageId,

            lead_source:
              leadSource,

            visitor_id:
              visitorId,

            referrer:
              document.referrer ||
              null,

            user_agent:
              navigator.userAgent,
          }),
      }
    )

  }, [
    packageId,
    leadSource,
  ])

  return null
}