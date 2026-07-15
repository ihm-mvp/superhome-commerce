// app/listing/[slug]/components/ContactCard.tsx

type Props = {
  listing: any
}

export default function ContactCard({
  listing,
}: Props) {

  return (

    <section className="bg-white px-5 py-6">

      <h3 className="text-lg font-semibold text-gray-900">

        联系中介

      </h3>

      <div className="mb-4 text-sm text-gray-400">

        Contact Agent

      </div>

      <div className="rounded-2xl border border-gray-200 p-5">

        <div className="text-xl font-semibold text-gray-900">

          {listing.agent_name || "Agent"}

        </div>

        <div className="mt-1 text-gray-500">

          {listing.property_json?.office_name || ""}

        </div>

<div className="mt-6">

  <a
    href= "block w-full rounded-xl bg-black py-3 text-center text-white"
  >

    <div className="font-semibold">

      📞 联系 {listing.agent_name}

    </div>

    <div className="text-xs text-gray-300">

      Contact {listing.agent_name}

    </div>

  </a >

</div>

      </div>

    </section>

  )

}