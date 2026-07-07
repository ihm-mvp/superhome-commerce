// app/listing/[slug]/components/EventCard.tsx

type Props = {
  listing: any
  event: any
}

export default function EventCard({
  listing,
  event,
}: Props) {

  return (

    <section className="bg-white px-5 py-5">

      <h3 className="mb-4 text-lg font-semibold text-gray-900">

        Next Viewing

      </h3>

      <div className="rounded-2xl border border-gray-200 p-5">

        {event ? (

          <>

            <div className="text-sm text-gray-500">

              Open Home

            </div>

            <div className="mt-2 text-2xl font-bold">

              {formatDate(
                event.openhome_date
              )}

            </div>

            <div className="mt-1 text-lg">

              {formatTime(
                event.start_time
              )}

              {" - "}

              {formatTime(
                event.end_time
              )}

            </div>

            <button
              className="mt-5 w-full rounded-xl bg-black py-3 text-white font-semibold"
            >

              Add to Calendar

            </button>

          </>

        ) : (

          <>

            <div className="text-sm text-gray-500">

              Viewing

            </div>

            <div className="mt-2 text-2xl font-bold">

              By Appointment

            </div>

            <div className="mt-5 text-gray-600">

              Please contact the agent to arrange
              a private viewing.

            </div>

          </>

        )}

      </div>

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

  return value.slice(0,5)

}