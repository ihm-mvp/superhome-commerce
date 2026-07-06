"use client"

export const metadata = {
  title: "Listing Import | MoveInReady",
  description: "Import TradeMe listings into MoveInReady.",
}

export default function ListingPage() {

  async function importListing() {

    const input = document.getElementById("trademeUrl") as HTMLInputElement

    if (!input.value.trim()) {
      alert("Please enter a TradeMe URL.")
      return
    }

    const res = await fetch("/api/listing/import", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: input.value,
      }),
    })

    const data = await res.json()

    alert(
      data.success
        ? "Listing imported successfully."
        : data.message
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">

      <div>
        <h1 className="text-3xl font-semibold">
          Listing Import
        </h1>

        <p className="mt-3 text-gray-600">
          Paste a TradeMe property URL to import the listing into MoveInReady.
        </p >
      </div>

      <div className="border rounded-xl p-6 space-y-4">

        <label className="block text-sm font-medium">
          TradeMe URL
        </label>

        <input
          id="trademeUrl"
          type="url"
          placeholder="https://www.trademe.co.nz/..."
          className="w-full border rounded-lg px-4 py-3"
        />

        <button
          id="importButton"
          type="button"
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
          onClick={importListing}
        >
          Import Listing
        </button>

      </div>

      <div className="border rounded-xl p-6">

        <h2 className="font-semibold mb-3">
          MVP Workflow
        </h2>

        <ol className="list-decimal pl-5 text-gray-600 space-y-2">
          <li>Paste TradeMe URL</li>
          <li>Import property</li>
          <li>Save Listing</li>
          <li>Save Open Home</li>
          <li>Prepare AI draft</li>
        </ol>

      </div>

    </div>
  )
}