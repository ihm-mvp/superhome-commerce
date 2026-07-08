// app/listing/[slug]/components/WhyThisProperty.tsx

type Props = {
  listing: any
}

export default function WhyThisProperty({
  listing,
}: Props) {

  const highlights = [

    {
      icon: "☀️",
      zh: "明亮朝北客厅，采光充足",
      en: "Bright north-facing living area",
    },

    {
      icon: "🏡",
      zh: "四房家庭布局，适合成长型家庭",
      en: "Four-bedroom family layout",
    },

    {
      icon: "🎓",
      zh: "优质学区，生活便利",
      en: "Excellent school zoning",
    },

    {
      icon: "🛍️",
      zh: "靠近商圈与生活配套",
      en: "Close to shopping and amenities",
    },

    {
      icon: "🔑",
      zh: "即可入住，省时省心",
      en: "Move-in ready",
    },

  ]

  return (

    <section className="bg-white px-5 py-6">

      <h3 className="text-lg font-semibold text-gray-900">

        为什么值得看

      </h3>

      <div className="mb-5 text-sm text-gray-400">

        Why This Property

      </div>

      <div className="space-y-4">

        {highlights.map(

          (
            item,
            index
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