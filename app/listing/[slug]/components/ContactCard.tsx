type Props = {
  listing: any
}

export default function ContactCard({
  listing,
}: Props) {

  return (

    <section className="bg-white px-5 py-6">

      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        Contact Agent
      </h3>

      <div className="rounded-2xl border border-gray-200 p-5">

        <div className="text-xl font-semibold text-gray-900">
          {listing.agent_name || "Agent"}
        </div>

        <div className="mt-1 text-gray-500">
          {listing.property_json?.office_name || ""}
        </div>

        <div className="mt-6">

          <button
            className="w-full rounded-xl bg-black py-3 font-semibold text-white"
          >
            Contact Agent
          </button>

        </div>

      </div>

    </section>

  )

}