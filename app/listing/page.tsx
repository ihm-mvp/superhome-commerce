"use client"

import { useState } from "react"

export default function ListingPage() {

  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [success, setSuccess] = useState(false)

  async function handleImport() {

    if (!url.trim()) {
      setSuccess(false)
      setMessage("Please enter a TradeMe URL.")
      return
    }

    try {

      setLoading(true)
      setMessage("")

      const res = await fetch("/api/listing/import", {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          url
        })

      })

      const data = await res.json()

      setSuccess(data.success)

      setMessage(
        data.message ??
        (data.success
          ? "Listing imported successfully."
          : "Import failed.")
      )

    } catch (e: any) {

      setSuccess(false)

      setMessage(
        e.message ??
        "Network error."
      )

    } finally {

      setLoading(false)

    }

  }

  return (

    <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">

      <div>

        <h1 className="text-3xl font-semibold">
          Listing Import
        </h1>

        <p className="mt-3 text-gray-600 leading-relaxed">
          Import a TradeMe listing into MoveInReady.
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
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.trademe.co.nz/..."
            className="w-full rounded-lg border px-4 py-3 outline-none focus:ring"
          />

        </div>

        <button
          onClick={handleImport}
          disabled={loading}
          className="bg-black text-white rounded-lg px-6 py-3 disabled:opacity-50"
        >
          {loading
            ? "Importing..."
            : "Import Listing"}
        </button>

        {message && (

          <div
            className={`rounded-lg px-4 py-3 text-sm ${
              success
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message}
          </div>

        )}

      </div>

      <div className="border rounded-xl p-6">

        <h2 className="font-semibold mb-4">
          Current MVP Workflow
        </h2>

        <ol className="list-decimal pl-5 space-y-2 text-gray-600">

          <li>Paste TradeMe URL</li>

          <li>Read TradeMe HTML</li>

          <li>Extract Listing Data</li>

          <li>Save Listing</li>

          <li>Save Open Homes</li>

          <li>Generate AI Draft (Next Stage)</li>

        </ol>

      </div>

    </div>

  )

}