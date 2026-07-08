// app/listing/[slug]/page.tsx

import { notFound } from "next/navigation"

import { supabase } from "@/lib/supabase"

import Hero from "./components/Hero"
import QuickFacts from "./components/QuickFacts"
import EventCard from "./components/EventCard"
import WhyThisProperty from "./components/WhyThisProperty"
import ContactCard from "./components/ContactCard"

type Props = {
  params: Promise<{
    slug: string
  }>
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

  return (

    <main className="min-h-screen bg-white">

      <Hero
        listing={listing}
      />

      <QuickFacts
        listing={listing}
      />

      <EventCard
        listing={listing}
        event={events}
      />

      <WhyThisProperty
        listing={listing}
      />

      <ContactCard
        listing={listing}
      />

    </main>

  )

}