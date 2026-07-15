// app/listing/[slug]/components/WhyThisProperty.tsx

type Props = {
  listing: any
}

export default function WhyThisProperty({
  listing,
}: Props) {

  const highlights =
    listing.ai_content?.slug_highlights || []

  return (

    <section className="bg-white px-5 py-6">

      <h3 className="text-lg font-semibold text-gray-900">

        为什么值得看

      </h3>

      <div className="mb-5 text-sm text-gray-400">

        Why This Home

      </div>

      <div className="space-y-4">

        {highlights.map(

          (
            item: any,
            index: number
          ) => (

            <div
              key={index}
              className="rounded-2xl border border-gray-200 p-5"
            >

              <div className="flex items-start gap-4">

                <div className="text-3xl">

                  {item.icon}

                </div>

                <div className="flex-1">

                  <div className="font-semibold text-gray-900">

                    {item.zh}

                  </div>

                  <div className="mt-1 text-sm text-gray-500">

                    {item.en}

                  </div>

                </div>

              </div>

            </div>

          )

        )}

      </div>

    </section>

  )

}