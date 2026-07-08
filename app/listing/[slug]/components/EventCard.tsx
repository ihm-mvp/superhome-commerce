// app/listing/[slug]/components/EventCard.tsx

type Props = {
  listing: any
  event: any
}

export default function EventCard({
  listing,
  event,
}: Props) {

  const events = event || []

  return (

    <section className="bg-white px-5 py-5">

      <h3 className="text-lg font-semibold text-gray-900">

        看房安排

      </h3>

      <div className="mb-4 text-sm text-gray-400">

        Upcoming Viewings

      </div>

      {events.length > 0 ? (

        <div className="space-y-4">

          {events.map(

            (
              item: any,
              index: number
            ) => (

              <div
                key={index}
                className="rounded-2xl border border-gray-200 p-5"
              >

                <div className="text-sm font-medium text-gray-700">

                  开放参观

                </div>

                <div className="text-xs text-gray-400">

                  Open Home

                </div>

                <div className="mt-3 text-2xl font-bold text-gray-900">

                  {formatDate(
                    item.openhome_date
                  )}

                </div>

                <div className="mt-1 text-lg text-gray-900">

                  {formatTime(
                    item.start_time
                  )}

                  {" - "}

                  {formatTime(
                    item.end_time
                  )}

                </div>

                <button
                  className="mt-5 w-full rounded-xl bg-black py-3 font-semibold text-white"
                >

                  加入日历

                  <div className="text-xs font-normal text-gray-300">

                    Add to Calendar

                  </div>

                </button>

              </div>

            )

          )}

        </div>

      ) : (

        <div className="rounded-2xl border border-gray-200 p-5">

          <div className="text-sm font-medium text-gray-700">

            预约看房

          </div>

          <div className="text-xs text-gray-400">

            Private Viewing

          </div>

          <div className="mt-3 text-2xl font-bold text-gray-900">

            请预约

          </div>

          <div className="text-sm text-gray-500">

            By Appointment

          </div>

          <div className="mt-5 text-gray-600">

            请联系中介预约专属看房时间。

          </div>

          <div className="text-sm text-gray-400">

            Please contact the agent to arrange
            a private viewing.

          </div>

        </div>

      )}

    </section>

  )

}

function formatDate(
  value: string
) {

  return new Date(value)
    .toLocaleDateString(
      "en-NZ",
      {

        weekday: "short",

        day: "numeric",

        month: "short",

      }

    )

}

function formatTime(
  value: string
) {

  return value.slice(0, 5)

}