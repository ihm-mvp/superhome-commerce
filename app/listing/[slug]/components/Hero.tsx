// app/listing/[slug]/components/Hero.tsx

"use client"

type Props = {
  listing: any
}

import { useState } from "react"

export default function Hero({
  listing,
}: Props) {

  const photos =

    listing.property_json?.photos || []

    const [current, setCurrent] =

  useState(0)

  return (

    <section className="bg-white">

      {/* Hero Images */}

<div
  className="
    flex
    overflow-x-auto
    snap-x
    snap-mandatory
    scrollbar-hide
  "
  onScroll={(e) => {

    const el = e.currentTarget

    const index = Math.round(

      el.scrollLeft /

      el.clientWidth

    )

    setCurrent(index)

  }}
>

        {photos.length > 0 ? (

          photos.map(

            (
              photo: string,
              index: number
            ) => (

              <div
                key={index}
                className="
                  relative
                  min-w-full
                  snap-center
                "
              >

                <img
                  src={photo}
                  alt={listing.address}
                  className="
                    w-full
                    aspect-[16/10]
                    object-cover
                  "
                />

                {index === 0 && (

                  <div className="absolute top-4 left-4">

                    <div className="absolute top-4 right-4 rounded-full bg-black/60 px-3 py-1 text-sm font-semibold text-white">

  {current + 1} / {photos.length}

</div>

                    <span className="rounded-full bg-green-600 px-3 py-1 text-sm font-semibold text-white">

                      在售 · For Sale

                    </span>

                  </div>

                )}

              </div>

            )

          )

        ) : (

          <div className="w-full aspect-[16/10] bg-gray-200" />

        )}

      </div>

      {/* Content */}

      <div className="px-5 py-6">

        <div className="text-sm font-medium text-gray-500">

          售价

        </div>

        <div className="text-xs text-gray-400">

          Asking Price

        </div>

        <h1 className="mt-2 text-4xl font-bold text-gray-900">

          {listing.price}

        </h1>

        <h2 className="mt-5 text-xl font-semibold leading-snug text-gray-900">

          {listing.address}

        </h2>

        {listing.ai_content?.slug_highlights?.[0] && (

  <div className="mt-4 flex items-center gap-2">

    <span className="text-xl">

      {listing.ai_content.slug_highlights[0].icon}

    </span>

    <div>

      <div className="font-semibold text-gray-900">

        {listing.ai_content.slug_highlights[0].zh}

      </div>

      <div className="text-sm text-gray-500">

        {listing.ai_content.slug_highlights[0].en}

      </div>

    </div>

  </div>

)}

      </div>

    </section>

  )

}