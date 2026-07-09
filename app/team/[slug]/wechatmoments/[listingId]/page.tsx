// app/team/[slug]/wechatmoments/[listingId]/page.tsx

"use client"

import { useEffect, useState } from "react"

import { useRouter } from "next/navigation"

import { supabase } from "@/lib/supabase"

type Props = {

  params: Promise<{

    slug: string

    listingId: string

  }>

}

type Listing = {

  id: string

  address: string | null

  headline: string | null

  slug: string | null

  qrcode_url: string | null

  ai_content: any

  property_json: any

}

export default function WechatMomentsPage({

  params,

}: Props) {

  const router =

    useRouter()

  const [slug, setSlug] =

    useState("")

  const [listing, setListing] =

    useState<Listing | null>(null)

  const [loading, setLoading] =

    useState(true)

  useEffect(() => {

    async function load() {

      const resolved =

        await params

      setSlug(

        resolved.slug

      )

      const {

        data,

      } = await supabase

        .from(

          "listing_listings"

        )

        .select("*")

        .eq(

          "id",

          resolved.listingId

        )

        .single()

      if (

        data

      ) {

        setListing(

          data

        )

      }

      setLoading(

        false

      )

    }

    load()

  }, [

    params,

  ])

  async function copyCaption() {

    if (

      !listing

    )

      return

    await navigator.clipboard.writeText(

      listing.ai_content
        ?.wechat_caption || ""

    )

    alert(

      "Copied."

    )

  }

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

    !listing

  ) {

    return (

      <div className="flex min-h-screen items-center justify-center">

        Listing not found.

      </div>

    )

  }

  const photos =

    listing.property_json
      ?.photos || []

  return (

    <main className="min-h-screen bg-gray-50">

      <div className="mx-auto max-w-md px-5 py-6">

        <button

          onClick={() =>
            router.push(
              `/team/${slug}`
            )
          }

          className="mb-6 text-sm font-medium"

        >

          ← Back

        </button>

        <h1 className="text-2xl font-bold">

          朋友圈九宫格 · 点击下载

        </h1>

        <div className="mt-1 text-gray-500">

          {listing.address}

        </div>

        <div className="mt-8 grid grid-cols-3 gap-2">

          {photos
            .slice(
              0,
              4
            )
            .map(

              (
                photo: string,
                index: number
              ) => (

                <img

                  key={index}

                  src={photo}

                  alt=""

                  onClick={() =>
                    window.open(
                      photo,
                      "_blank"
                    )
                  }

                  className="aspect-square w-full rounded-lg object-cover"

                />

              )

            )}

          <img

            src={
              listing.qrcode_url ||
              ""
            }

            alt="QR"

            onClick={() =>
              window.open(
                listing.qrcode_url ||
                  "",
                "_blank"
              )
            }

            className="aspect-square w-full rounded-lg border bg-white p-2 object-contain"

          />

          {photos
            .slice(
              4,
              8
            )
            .map(

              (
                photo: string,
                index: number
              ) => (

                <img

                  key={
                    index + 4
                  }

                  src={photo}

                  alt=""

                  onClick={() =>
                    window.open(
                      photo,
                      "_blank"
                    )
                  }

                  className="aspect-square w-full rounded-lg object-cover"

                />

              )

            )}
                    </div>

        <div className="mt-8">

          <div className="text-lg font-semibold">

            朋友圈文案 · 点击复制

          </div>

          <div className="mt-4 rounded-2xl border bg-white p-5 whitespace-pre-wrap leading-7">

            {

              listing.ai_content
                ?.wechat_caption

            }

          </div>

        </div>

        <button

          onClick={
            copyCaption
          }

          className="mt-6 w-full rounded-xl bg-black py-4 text-lg font-semibold text-white"

        >

          复制朋友圈文案

        </button>

      </div>

    </main>

  )

}