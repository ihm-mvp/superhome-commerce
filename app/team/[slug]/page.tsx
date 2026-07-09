// app/team/[slug]/page.tsx

"use client"

import { useEffect, useState } from "react"

import { supabase } from "@/lib/supabase"

type Team = {

  id: string

  team_name: string

  login_email: string

  team_slug: string

  status: string

}

type Listing = {

  id: string

  address: string | null

  headline: string | null

  price: string | null

  listing_status: string | null

  property_json: any

}

type OpenHome = {

  listing_id: string

  openhome_date: string

  start_time: string | null

  end_time: string | null

}

type MarketingListing = {

  listing: Listing

  openhome?: OpenHome

}

type Props = {

  params: Promise<{

    slug: string

  }>

}

export default function TeamPage({

  params,

}: Props) {

  const [loading, setLoading] =

    useState(true)

  const [team, setTeam] =

    useState<Team | null>(null)

  const [listings, setListings] =

    useState<MarketingListing[]>([])

  useEffect(() => {

    async function load() {

      const {

        slug,

      } = await params

      // --------------------------
      // Team
      // --------------------------

      const {

        data: teamData,

      } = await supabase

        .from("team_accounts")

        .select("*")

        .eq(

          "team_slug",

          slug

        )

        .eq(

          "status",

          "Active"

        )

        .single()

      if (

        !teamData

      ) {

        setLoading(false)

        return

      }

      setTeam(

        teamData

      )

      // --------------------------
      // Listings
      // --------------------------

      const {

        data: listingData,

      } = await supabase

        .from("listing_listings")

        .select("*")

        .eq(

          "team_id",

          teamData.id

        )

        .eq(

          "listing_status",

          "Active"

        )

        .order(

          "created_at",

          {

            ascending: false,

          }

        )

      if (

        !listingData ||

        listingData.length === 0

      ) {

        setLoading(false)

        return

      }

      // --------------------------
      // Open Homes
      // --------------------------

      const listingIds =

        listingData.map(

          (

            item

          ) => item.id

        )

      const {

        data: openHomeData,

      } = await supabase

        .from(

          "listing_openhomes"

        )

        .select("*")

        .in(

          "listing_id",

          listingIds

        )

        .eq(

          "status",

          "Active"

        )

        .order(

          "openhome_date",

          {

            ascending: true,

          }

        )

        .order(

          "start_time",

          {

            ascending: true,

          }

        )

      const merged: MarketingListing[] =

        listingData.map(

          (

            listing

          ) => ({

            listing,

            openhome:

              openHomeData?.find(

                (

                  item

                ) =>

                  item.listing_id ===

                  listing.id

              ),

          })

        )

      setListings(

        merged

      )

      setLoading(false)

    }

    load()

  }, [

    params,

  ])

  if (

    loading

  ) {

    return (

      <div className="flex min-h-screen items-center justify-center">

        Loading...

      </div>

    )

  }

  if (

    !team

  ) {

    return (

      <div className="flex min-h-screen items-center justify-center">

        Team not found.

      </div>

    )

  }
    return (

    <main className="min-h-screen bg-gray-50">

      <div className="mx-auto max-w-md px-5 py-6">

        <h1 className="text-3xl font-bold">

          {team.team_name}

        </h1>

        <div className="mt-2 text-gray-500">

          Marketing Toolkit

        </div>

        <div className="mt-8">

          <h2 className="text-xl font-semibold">

            Before Open Home

          </h2>

        </div>

        <div className="mt-6 space-y-8">

          {listings.map(

            (item) => {

              const listing =

                item.listing

              const photos =

                listing.property_json?.photos || []

              return (

                <div
                  key={listing.id}
                  className="overflow-hidden rounded-2xl border bg-white"
                >

                  {photos.length > 0 ? (

                    <img

                      src={photos[0]}

                      alt={
                        listing.address || ""
                      }

                      className="aspect-[3/2] w-full object-cover"

                    />

                  ) : (

                    <div className="aspect-[3/2] w-full bg-gray-200" />

                  )}

                  <div className="p-5">

                    <div className="text-xl font-semibold leading-snug">

                      {listing.address}

                    </div>

                    {item.openhome && (

                      <div className="mt-5 rounded-xl bg-gray-100 p-4">

                        <div className="text-sm text-gray-500">

                          Open Home

                        </div>

                        <div className="mt-2 font-semibold">

                          {item.openhome.openhome_date}

                        </div>

                        <div className="text-gray-600">

                          {item.openhome.start_time}

                          {" - "}

                          {item.openhome.end_time}

                        </div>

                      </div>

                    )}

<div className="mt-6 space-y-3">

  <button

    onClick={() =>

      window.location.href =

      `/team/${team.team_slug}/wechatmoments/${listing.id}`

    }

    className="w-full rounded-xl bg-black py-3 font-semibold text-white"

  >

    📱 朋友圈九宫格

  </button>

  <button

    onClick={() =>

      window.location.href =

      `/team/${team.team_slug}/wechatofficialaccounts/${listing.id}`

    }

    className="w-full rounded-xl border py-3 font-semibold"

  >

    ✍️ 公众号推文

  </button>

<div className="mt-6 rounded-2xl border bg-white p-5">

  <div className="text-center">

    <div className="text-lg font-semibold">

      Listing QR Code

    </div>

    <div className="mt-2 text-sm text-gray-500">

      Long press to save

    </div>

  </div>

  <div className="mt-5 flex justify-center">

    <img

      src={
        listing.qrcode_url ||
        ""
      }

      alt="Listing QR Code"

      onClick={() =>
        window.open(
          listing.qrcode_url ||
            "",
          "_blank"
        )
      }

      className="w-52 rounded-xl border bg-white p-3"

    />

  </div>

</div>

</div>

                  </div>

                </div>

              )

            }

          )}

        </div>

      </div>

    </main>

  )

}