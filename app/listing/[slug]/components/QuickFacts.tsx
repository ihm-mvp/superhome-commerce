// app/listing/[slug]/components/QuickFacts.tsx

type Props = {
  listing: any
}

export default function QuickFacts({
  listing,
}: Props) {

  return (

    <section className="bg-white px-5 py-5">

      <h3 className="mb-4 text-lg font-semibold text-gray-900">

        Property Snapshot

      </h3>

      <div className="grid grid-cols-2 gap-4">

        <FactCard
          icon="🛏"
          label="Bedrooms"
          value={listing.bedrooms}
        />

        <FactCard
          icon="🛁"
          label="Bathrooms"
          value={listing.bathrooms}
        />

        <FactCard
          icon="🚗"
          label="Garages"
          value={listing.garages}
        />

        <FactCard
          icon="📐"
          label="Floor Area"
          value={
            listing.floor_area
              ? `${listing.floor_area}㎡`
              : "-"
          }
        />

        <FactCard
          icon="🌳"
          label="Land Area"
          value={
            listing.land_area
              ? `${listing.land_area}㎡`
              : "-"
          }
        />

      </div>

    </section>

  )

}

function FactCard({

  icon,

  label,

  value,

}: any) {

  return (

    <div className="rounded-xl border border-gray-200 p-4">

      <div className="text-2xl">

        {icon}

      </div>

      <div className="mt-2 text-sm text-gray-500">

        {label}

      </div>

      <div className="mt-1 text-xl font-semibold text-gray-900">

        {value ?? "-"}

      </div>

    </div>

  )

}