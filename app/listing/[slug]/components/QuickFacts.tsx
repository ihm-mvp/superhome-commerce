// app/listing/[slug]/components/QuickFacts.tsx

type Props = {
  listing: any
}

export default function QuickFacts({
  listing,
}: Props) {

  return (

    <section className="bg-white px-5 py-5">

      <h3 className="text-lg font-semibold text-gray-900">

        房屋信息

      </h3>

      <div className="mb-4 text-sm text-gray-400">

        Home Details

      </div>

      <div className="grid grid-cols-2 gap-4">

        <FactCard
          icon="🛏"
          label="卧室"
          subLabel="Bedrooms"
          value={listing.bedrooms}
        />

        <FactCard
          icon="🛁"
          label="卫生间"
          subLabel="Bathrooms"
          value={listing.bathrooms}
        />

        <FactCard
          icon="🚗"
          label="车库"
          subLabel="Garages"
          value={listing.garages}
        />

        <FactCard
          icon="📐"
          label="室内面积"
          subLabel="Floor Area"
          value={
            listing.floor_area
              ? `${listing.floor_area}㎡`
              : "-"
          }
        />

        <FactCard
          icon="🌳"
          label="土地面积"
          subLabel="Land Area"
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

  subLabel,

  value,

}: any) {

  return (

    <div className="rounded-xl border border-gray-200 p-4">

      <div className="text-2xl">

        {icon}

      </div>

      <div className="mt-3 text-sm font-medium text-gray-700">

        {label}

      </div>

      <div className="text-xs text-gray-400">

        {subLabel}

      </div>

      <div className="mt-2 text-2xl font-semibold text-gray-900">

        {value ?? "-"}

      </div>

    </div>

  )

}