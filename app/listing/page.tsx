"use client"

import { useState } from "react"

export default function ListingPage() {

  const [url, setUrl] = useState("")

  const [loading, setLoading] =
    useState(false)

  const [success, setSuccess] =
    useState(false)

  const [message, setMessage] =
    useState("")

  async function handleImport() {

    if (!url.trim()) {

      setSuccess(false)

      setMessage(
        "Please enter a TradeMe URL."
      )

      return

    }

    try {

      setLoading(true)

      setMessage("")

      const res = await fetch(

        "/api/listing/import",

        {

          method: "POST",

          headers: {

            "Content-Type":
              "application/json"

          },

          body: JSON.stringify({

            url

          })

        }

      )

      const data =
        await res.json()

      setSuccess(
        data.success
      )

      setMessage(

        data.message ??

        (

          data.success

            ? "Listing imported successfully."

            : "Import failed."

        )

      )

      if (data.success) {

        setUrl("")

      }

    }

    catch (e: any) {

      setSuccess(false)

      setMessage(

        e.message ??

        "Network error."

      )

    }

    finally {

      setLoading(false)

    }

  }

  return (

    <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">

      <div>

        <h1 className="text-3xl font-semibold">

          Listing Import

        </h1>

        <p className="mt-3 text-gray-600">

          Import a TradeMe property into MoveInReady.

        </p >

      </div>

      <div className="border rounded-xl p-6 space-y-5">

        <div>

          <label className="block text-sm font-medium mb-2">

            TradeMe Listing URL

          </label>

          <input

            type="url"

            value={url}

            onChange={(e) =>

              setUrl(e.target.value)

            }

            placeholder="https://www.trademe.co.nz/a/property/residential/sale/..."

            className="w-full rounded-lg border px-4 py-3"

          />

        </div>

        <button

          onClick={handleImport}

          disabled={loading}

          className="rounded-lg bg-black text-white px-6 py-3 disabled:opacity-50"

        >

          {

            loading

              ? "Importing..."

              : "Import Listing"

          }

        </button>

        {

          message && (

            <div

              className={

                success

                  ? "rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700"

                  : "rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700"

              }

            >

              {message}

            </div>

          )

        }

      </div>

      <div className="border rounded-xl p-6">

        <h2 className="font-semibold mb-4">

          Current Workflow

        </h2>

        <ol className="list-decimal pl-5 space-y-2 text-gray-600">

          <li>Paste TradeMe URL</li>

          <li>Download TradeMe HTML</li>

          <li>Extract Redux / Initial State</li>

          <li>Parse Listing JSON</li>

          <li>Map to MIR Property</li>

          <li>Save listing_listings</li>

          <li>Save listing_openhomes</li>

        </ol>

      </div>

    </div>

  )

}