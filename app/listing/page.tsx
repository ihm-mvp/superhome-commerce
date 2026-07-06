"use client"

import {
  useState,
} from "react"

export default function ListingPage() {

  const [
    url,
    setUrl,
  ] = useState("")

  const [
    loading,
    setLoading,
  ] = useState(false)

  const [
    result,
    setResult,
  ] = useState<any>(null)

  async function importListing() {

    if (!url) {

      alert(
        "Please enter TradeMe URL."
      )

      return

    }

    setLoading(true)

    setResult(null)

    const res =
      await fetch(
        "/api/listing/import",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({

              url,

            }),

        }
      )

    const json =
      await res.json()

    setLoading(false)

    setResult(json)

  }

  return (

    <div
      className="
        max-w-3xl
        mx-auto
        px-6
        py-10
        space-y-6
      "
    >

      <h1
        className="
          text-3xl
          font-semibold
        "
      >
        Listing Import
      </h1>

      <div
        className="
          text-gray-500
        "
      >
        Import a TradeMe listing into MIR.
      </div>

      <input
        type="text"
        value={url}
        onChange={(e) =>
          setUrl(
            e.target.value
          )
        }
        placeholder="https://www.trademe.co.nz/..."
        className="
          w-full
          border
          rounded-lg
          px-4
          py-3
        "
      />

      <button
        onClick={
          importListing
        }
        disabled={
          loading
        }
        className="
          bg-black
          text-white
          px-6
          py-3
          rounded-lg
          disabled:opacity-50
        "
      >

        {loading

          ? "Importing..."

          : "Import Listing"}

      </button>

      {result && (

        <div
          className="
            border
            rounded-xl
            p-5
            bg-gray-50
          "
        >

          {result.success ? (

            <div
              className="
                text-green-700
              "
            >

              Import Success

              <div
                className="
                  mt-2
                  text-sm
                  text-gray-600
                "
              >

                Listing ID:

                {" "}

                {result.id}

              </div>

            </div>

          ) : (

            <div
              className="
                text-red-600
              "
            >

              {result.error}

            </div>

          )}

        </div>

      )}

    </div>

  )

}