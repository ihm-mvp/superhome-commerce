// app/listing/[slug]/components/Hero.tsx

type Props = {
  listing: any
}

export default function Hero({
  listing,
}: Props) {

  const photo =

    listing.property_json?.photos?.[0] || ""

  return (

    <section className="bg-white">

      {/* Hero Image */}

      <div className="relative">

        {photo ? (

          <img
            src={photo}
            alt={listing.address}
            className="w-full aspect-video object-cover"
          />

        ) : (

          <div className="w-full aspect-video bg-gray-200" />

        )}

        <div className="absolute top-4 left-4">

          <span className="rounded-full bg-green-600 px-3 py-1 text-sm font-semibold text-white">

            For Sale

          </span>

        </div>

      </div>

      {/* Content */}

      <div className="px-5 py-6">

        {/* Price */}

        <h1 className="text-3xl font-bold text-gray-900">

          {listing.price}

        </h1>

        {/* Address */}

        <h2 className="mt-3 text-xl font-semibold text-gray-900">

          {listing.address}

        </h2>

      </div>

    </section>

  )

}