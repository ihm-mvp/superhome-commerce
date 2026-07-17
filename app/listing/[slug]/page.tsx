// app/listing/[slug]/page.tsx

import { notFound } from "next/navigation"

import { supabase } from "@/lib/supabase"

import Hero from "./components/Hero"
import QuickFacts from "./components/QuickFacts"
import EventCard from "./components/EventCard"
import WhyThisProperty from "./components/WhyThisProperty"

import ContactCard from "./components/ContactCard"

import type { Metadata } from "next"

type Props = {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata(
  {
    params,
  }: Props
): Promise<Metadata> {

  const { slug } = await params

  const {
    data: listing,
  } = await supabase

    .from("listing_listings")

    .select("*")

    .eq("slug", slug)

    .single()

  if (!listing) {

    return {

      title: "MoveInReady",

    }

  }

  const image =

    listing.property_json?.photos?.[0] ||

    ""

  return {

    title:

      listing.address,

    description:

      listing.ai_content

        ?.wechat_caption ||

      listing.price ||

      "MoveInReady",

    openGraph: {

      title:

        listing.address,

      description:

        listing.ai_content

          ?.wechat_caption ||

        listing.price ||

        "",

      images: [

        image,

      ],

      type:

        "website",

    },

  }

}

export default async function ListingPage({
  params,
}: Props) {

  const { slug } = await params

  const {
    data: listing,
    error,
  } = await supabase
    .from("listing_listings")
    .select("*")
    .eq("slug", slug)
    .single()

  if (
    error ||
    !listing
  ) {

    notFound()

  }

  const {
    data: events,
  } = await supabase
    .from("listing_openhomes")
    .select("*")
    .eq(
      "listing_id",
      listing.id
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


    const {

  data: auctions,

} = await supabase

  .from(

    "listing_auctions"

  )

  .select("*")

  .eq(

    "listing_id",

    listing.id

  )

  .eq(

    "status",

    "Active"

  )

  .order(

    "auction_date",

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

  return (

    <main className="min-h-screen bg-white">

      <Hero
        listing={listing}
      />

            <WhyThisProperty
        listing={listing}
      />

      <QuickFacts
        listing={listing}
      />

      <EventCard
        listing={listing}
        event={events}
        auctions={auctions}
      />

      <ContactCard
        listing={listing}
      />

    </main>

  )

}