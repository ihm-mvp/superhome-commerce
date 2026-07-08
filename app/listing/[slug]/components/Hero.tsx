// app/listing/[slug]/components/Hero.tsx

type Props = {
  listing: any
}

export default function Hero({
  listing,
}: Props) {

  const photos =

    listing.property_json?.photos || []

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
                    aspect-[3/2]
                    object-cover
                  "
                />

                {index === 0 && (

                  <div className="absolute top-4 left-4">

                    <span className="rounded-full bg-green-600 px-3 py-1 text-sm font-semibold text-white">

                      在售 · For Sale

                    </span>

                  </div>

                )}

              </div>

            )

          )

        ) : (

          <div className="w-full aspect-[3/2] bg-gray-200" />

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

      </div>

    </section>

  )

}