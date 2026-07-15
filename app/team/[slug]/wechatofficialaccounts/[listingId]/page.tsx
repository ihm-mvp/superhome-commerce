// app/team/[slug]/wechatofficialaccounts/[listingId]/page.tsx

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

export default function WechatOfficialAccountsPage({

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

  async function copyArticle() {

    if (

      !listing

    )

      return

    await navigator.clipboard.writeText(

      listing.ai_content
        ?.wechat_article || ""

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

  const hero =

    listing.property_json
      ?.photos?.[0] || ""

  return (

    <main className="min-h-screen bg-gray-50">

      <div className="mx-auto max-w-md">

        <button

          onClick={() =>
            router.push(
              `/team/${slug}`
            )
          }

          className="m-5 text-sm font-medium"

        >

          ← Back

        </button>

        {hero && (

          <img

            src={hero}

            alt=""

            className="aspect-[3/2] w-full object-cover"

          />

        )}

        <div className="px-5 py-6">

          <h1 className="text-2xl font-bold">

            公众号推文 · 点击复制

          </h1>

          <div className="mt-2 text-gray-500">

            {listing.address}

          </div>
          <div className="mt-8">

            <div className="rounded-2xl border bg-white p-5 whitespace-pre-wrap leading-8">

              {

                listing.ai_content
                  ?.wechat_article

              }

            </div>

          </div>

          <button

            onClick={
              copyArticle
            }

            className="mt-8 w-full rounded-xl bg-black py-4 text-lg font-semibold text-white"

          >

            复制公众号推文

          </button>

        </div>

      </div>

    </main>

  )

}