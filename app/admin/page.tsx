"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

export default function AdminDashboard() {

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [selectedPeriod, setSelectedPeriod] = useState("30d")

const [
  stats,
  setStats,
] = useState<any>({
  subscribers: 0,
  users: 0,

  packageViews: 0,

  proposals: 0,

  uniquePackageVisitors: 0,

  uniqueRequestVisitors: 0,

  packageToProposalRate: 0,

  packageToRequestRate: 0,

  packagePerformance: [],

latestRequest: null,

latestPackageView: null,

trend: [],

})

useEffect(() => {
  loadDashboard(selectedPeriod)
}, [selectedPeriod])

async function loadDashboard(period: string) {

    try {

const res = await fetch(
  `/api/admin/dashboard?period=${period}`
)

if (!res.ok) {
  throw new Error("Failed to load dashboard data")
}

      const data =
        await res.json()

      setStats(data)

    } catch (error) {

      console.error(error)

    } finally {

      setLoading(false)

    }

  }

  const trendData = stats.trend || []

const maxViews = Math.max(
  1,
  ...trendData.map((item: any) => item.views)
)

const maxRequests = Math.max(
  1,
  ...trendData.map((item: any) => item.requests)
)

const trendLabelStep = Math.max(
  1,
  Math.ceil(trendData.length / 10)
)

  return (

    <div
      className="
        max-w-7xl
        mx-auto
        p-8
        space-y-10
      "
    >

      {/* ===================== */}
      {/* Header */}
      {/* ===================== */}

      <div>

        <h1
          className="
            text-3xl
            font-semibold
          "
        >
          MoveInReady Admin
        </h1>

        <div
          className="
            text-gray-500
            mt-2
          "
        >
          Operations Dashboard
        </div>

      </div>

{/* ===================== */}
{/* Section C */}
{/* Latest Activity */}
{/* ===================== */}

<div
  className="
    border
    rounded-xl
    p-6
    bg-white
  "
>

  <h2
    className="
      text-xl
      font-semibold
      mb-4
    "
  >
    Latest Activity
  </h2>

  {loading ? (

    <div
      className="
        text-gray-400
      "
    >
      Loading...
    </div>

  ) : (

    <div
      className="
        grid
        md:grid-cols-3
        gap-4
      "
    >

      {/* ===================== */}
      {/* Latest Request */}
      {/* ===================== */}

      <div
        className="
          border
          rounded-lg
          p-4
        "
      >

        <div
          className="
            text-sm
            text-gray-400
            mb-3
          "
        >
          Request Proposal
        </div>

        {stats.latestRequest ? (

          <>

            <div className="font-medium">
              {
                stats.latestRequest.user
                  ?.first_name
              }
            </div>

            <div
              className="
                text-sm
                text-gray-500
                mt-1
              "
            >
              {
                stats.latestRequest.user
                  ?.email
              }
            </div>

            <div
              className="
                font-medium
                mt-3
              "
            >
              {
                stats.latestRequest.package
                  ?.name
              }
            </div>

<div
  className="
    text-sm
    text-gray-400
    mt-1
  "
>
  {
    stats.latestRequest.package
      ?.layout?.name
  }
</div>

{stats.latestRequest.package
  ?.layout?.location && (

  <div
    className="
      text-xs
      text-gray-400
      mt-1
    "
  >
    {
      stats.latestRequest.package
        ?.layout?.location
    }
  </div>

)}

            <div
              className="
                text-xs
                text-gray-400
                mt-1
              "
            >
              {
                stats.latestRequest.created_at
                  ?.substring(
                    0,
                    16
                  )
                  .replace("T", " ")
              }
            </div>

          </>

        ) : (

          <div className="text-gray-400">
            No request yet
          </div>

        )}

      </div>

      {/* ===================== */}
      {/* Latest Package View */}
      {/* ===================== */}

      <div
        className="
          border
          rounded-lg
          p-4
        "
      >

        <div
          className="
            text-sm
            text-gray-400
            mb-3
          "
        >
          Package View
        </div>

        {stats.latestPackageView ? (

          <>

            <div className="font-medium">
              {
                stats.latestPackageView.package
                  ?.name
              }
            </div>

            <div
  className="
    text-sm
    text-gray-400
    mt-1
  "
>
  {
    stats.latestPackageView.package
      ?.layout?.name
  }
</div>

{stats.latestPackageView.package
  ?.layout?.location && (

  <div
    className="
      text-xs
      text-gray-400
      mt-1
    "
  >
    {
      stats.latestPackageView.package
        ?.layout?.location
    }
  </div>

)}

            <div
              className="
                text-sm
                text-gray-500
                mt-1
              "
            >
              {
                stats.latestPackageView.lead_source
              }
            </div>

            <div
              className="
                text-xs
                text-gray-400
                mt-3
              "
            >
              {
                stats.latestPackageView.viewed_at
                  ?.substring(
                    0,
                    16
                  )
                  .replace("T", " ")
              }
            </div>

          </>

        ) : (

          <div className="text-gray-400">
            No package view yet
          </div>

        )}

      </div>

    </div>

  )}

</div>

      {/* ===================== */}
      {/* Section B */}
      {/* Dashboard Metrics */}
      {/* ===================== */}

      <div>

        <h2
          className="
            text-xl
            font-semibold
            mb-4
          "
        >
          Business Dashboard
        </h2>

<div
  className="
    grid
    md:grid-cols-2
    lg:grid-cols-3
    gap-6
  "
>

          <div
            className="
              border
              rounded-xl
              p-6
              bg-white
            "
          >

            <div
              className="
                text-sm
                text-gray-500
              "
            >
              Email Subscribers
            </div>

            <div
              className="
                text-3xl
                font-semibold
                mt-2
              "
            >
              {stats.subscribers}
            </div>

          </div>

          <div
            className="
              border
              rounded-xl
              p-6
              bg-white
            "
          >

            <div
              className="
                text-sm
                text-gray-500
              "
            >
              Registered Users
            </div>

            <div
              className="
                text-3xl
                font-semibold
                mt-2
              "
            >
              {stats.users}
            </div>

          </div>

                    <div
            className="
              border
              rounded-xl
              p-6
              bg-white
            "
          >

            <div
              className="
                text-sm
                text-gray-500
              "
            >
              Package Views
            </div>

            <div
              className="
                text-3xl
                font-semibold
                mt-2
              "
            >
              {stats.packageViews}
            </div>

          </div>

          <div
            className="
              border
              rounded-xl
              p-6
              bg-white
            "
          >

            <div
              className="
                text-sm
                text-gray-500
              "
            >
              Proposal Requests
            </div>

            <div
              className="
                text-3xl
                font-semibold
                mt-2
              "
            >
              {stats.proposals}
            </div>

          </div>

        </div>

      </div>

{/* ===================== */}
{/* Conversion Funnel */}
{/* ===================== */}

<div
  className="
    border
    rounded-xl
    p-6
    bg-white
    mt-6
  "
>

  <h3
    className="
      text-xl
      font-semibold
      mb-6
    "
  >
    Conversion Funnel
  </h3>

  <div
    className="
      flex
      flex-col
      items-center
      text-center
      space-y-2
    "
  >

    <div>

      <div
        className="
          text-sm
          text-gray-500
        "
      >
        Unique Package Visitors
      </div>

      <div
        className="
          text-3xl
          font-semibold
          mt-1
        "
      >
        {stats.uniquePackageVisitors || 0}
      </div>

    </div>

    <div
      className="
        text-2xl
        text-gray-300
      "
    >
      ↓
    </div>

    <div>

      <div
        className="
          text-sm
          text-gray-500
        "
      >
        Unique Request Visitors
      </div>

      <div
        className="
          text-3xl
          font-semibold
          mt-1
        "
      >
        {stats.uniqueRequestVisitors || 0}
      </div>

    </div>

  </div>

  <div
    className="
      border-t
      mt-8
      pt-6
      text-center
    "
  >

    <div
      className="
        text-sm
        text-gray-500
      "
    >
      Package Visitor → Request Visitor
    </div>

    <div
      className="
        text-2xl
        font-semibold
        mt-2
      "
    >
      {stats.packageToRequestRate || 0}%
    </div>

  </div>

</div>

      {/* ===================== */}
      {/* Package Performance */}
      {/* ===================== */}

      <div>

<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">

  <h2 className="text-xl font-semibold">
    Package Performance
  </h2>

  <select
    value={selectedPeriod}
    onChange={(event) => setSelectedPeriod(event.target.value)}
    className="border rounded-lg px-3 py-2 text-sm bg-white"
    aria-label="Select performance date range"
  >
    <option value="7d">Last 7 Days</option>
    <option value="30d">Last 30 Days</option>
    <option value="90d">Last 90 Days</option>
    <option value="all">All Time</option>
  </select>

</div>

{/* ===================== */}
{/* Package Performance Trend */}
{/* ===================== */}

<div className="border rounded-xl p-6 bg-white mb-6">

  <h3 className="text-lg font-semibold mb-6">
    Activity Trend
  </h3>

  {/* Package Views */}

  <div className="mb-8">

    <div className="flex items-center justify-between mb-3">
      <span className="text-sm text-gray-600">
        Package Views
      </span>

      <span className="text-sm font-semibold">
        {stats.packageViews}
      </span>
    </div>

    <div className="overflow-x-auto">
      <div className="flex items-end gap-1 h-28 min-w-max border-b pb-1">

        {trendData.map((item: any) => (

          <div
            key={`views-${item.date}`}
            className="flex flex-col items-center justify-end h-full"
            style={{ width: "18px" }}
            title={`${item.date}: ${item.views} views`}
          >

            <div
              className="w-3 rounded-t bg-blue-500"
              style={{
                height: `${Math.max(
                  item.views > 0 ? 3 : 0,
                  (item.views / maxViews) * 100
                )}%`,
              }}
            />

          </div>

        ))}

      </div>

      <div className="flex gap-1 mt-2 min-w-max">

        {trendData.map((item: any, index: number) => (

          <div
            key={`views-date-${item.date}`}
            className="text-[10px] text-gray-400 text-center"
            style={{ width: "18px" }}
          >

            {index % trendLabelStep === 0 ||
            index === trendData.length - 1
              ? item.date.slice(5)
              : ""}

          </div>

        ))}

      </div>
    </div>

  </div>

  {/* Proposal Requests */}

  <div>

    <div className="flex items-center justify-between mb-3">
      <span className="text-sm text-gray-600">
        Proposal Requests
      </span>

      <span className="text-sm font-semibold">
        {stats.proposals}
      </span>
    </div>

    <div className="overflow-x-auto">
      <div className="flex items-end gap-1 h-28 min-w-max border-b pb-1">

        {trendData.map((item: any) => (

          <div
            key={`requests-${item.date}`}
            className="flex flex-col items-center justify-end h-full"
            style={{ width: "18px" }}
            title={`${item.date}: ${item.requests} requests`}
          >

            <div
              className="w-3 rounded-t bg-emerald-500"
              style={{
                height: `${Math.max(
                  item.requests > 0 ? 3 : 0,
                  (item.requests / maxRequests) * 100
                )}%`,
              }}
            />

          </div>

        ))}

      </div>

      <div className="flex gap-1 mt-2 min-w-max">

        {trendData.map((item: any, index: number) => (

          <div
            key={`requests-date-${item.date}`}
            className="text-[10px] text-gray-400 text-center"
            style={{ width: "18px" }}
          >

            {index % trendLabelStep === 0 ||
            index === trendData.length - 1
              ? item.date.slice(5)
              : ""}

          </div>

        ))}

      </div>
    </div>

  </div>

  <div className="text-xs text-gray-400 mt-4">
    Each bar represents one day. Hover over a bar to see its date and count.
  </div>

</div>

        <div
          className="
            border
            rounded-xl
            bg-white
            overflow-x-auto
          "
        >

          <table className="w-full text-sm">

<thead>

  <tr
    className="
      border-b
      text-gray-500
    "
  >

    <th
      className="
        text-left
        p-4
        font-medium
      "
    >
      Package
    </th>

    <th
      className="
        text-right
        p-4
        font-medium
      "
    >
      Views
    </th>

    <th
      className="
        text-right
        p-4
        font-medium
      "
    >
      Unique Visitors
    </th>

    <th
      className="
        text-right
        p-4
        font-medium
      "
    >
      Requests
    </th>

    <th
      className="
        text-right
        p-4
        font-medium
      "
    >
      View → Request
    </th>

  </tr>

</thead>

            <tbody>

{stats.packagePerformance
  ?.slice()
.sort(
  (a: any, b: any) =>
    b.requests - a.requests ||
    b.uniqueVisitors - a.uniqueVisitors ||
    b.views - a.views
)
  .map(
    (item: any) => (

                    <tr
                      key={item.id}
                      className="
                        border-b
                        last:border-b-0
                      "
                    >

<td
  className="
    p-4
  "
>

  <div className="font-medium">
    {item.name}
  </div>

  <div className="text-sm text-gray-400 mt-1">
    {item.layoutName}
  </div>

  {item.layoutLocation && (
    <div className="text-xs text-gray-400 mt-1">
      {item.layoutLocation}
    </div>
  )}

</td>

                      <td
                        className="
                          p-4
                          text-right
                        "
                      >
                        {item.views}
                      </td>

                      <td
                        className="
                          p-4
                          text-right
                        "
                      >
                        {item.uniqueVisitors}
                      </td>

                      <td
                        className="
                          p-4
                          text-right
                        "
                      >
                        {item.requests}
                      </td>

                      <td
                        className="
                          p-4
                          text-right
                        "
                      >
                        {item.viewToRequestRate}%
                      </td>

                    </tr>

                  )
                )}

              {stats.packagePerformance
                ?.length === 0 && (

                <tr>

                  <td
                    colSpan={5}
                    className="
                      p-6
                      text-center
                      text-gray-400
                    "
                  >
                    No package data
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* ===================== */}
      {/* Section A */}
      {/* Builder Hub */}
      {/* ===================== */}

      <div>

        <h2
          className="
            text-xl
            font-semibold
            mb-4
          "
        >
          Link Hub
        </h2>

        <div
          className="
            grid
            md:grid-cols-2
            lg:grid-cols-3
            gap-6
          "
        >

          <Link
            href="/admin/package-pricing-calculator"
            className="
              border
              rounded-xl
              p-6
              hover:shadow-md
              transition
              bg-white
            "
          >

            <div
              className="
                font-semibold
                mb-2
              "
            >
              Pricing Calculator
            </div>

            <div
              className="
                text-sm
                text-gray-500
              "
            >
              Calculate package
              EXW, landed and
              display pricing
            </div>

          </Link>

          <Link
            href="/admin/package-builder"
            className="
              border
              rounded-xl
              p-6
              hover:shadow-md
              transition
              bg-white
            "
          >

            <div
              className="
                font-semibold
                mb-2
              "
            >
              Package Builder
            </div>

            <div
              className="
                text-sm
                text-gray-500
              "
            >
              Create layouts,
              packages and rooms
            </div>

          </Link>

          <Link
            href="/admin/opening-builder"
            className="
              border
              rounded-xl
              p-6
              hover:shadow-md
              transition
              bg-white
            "
          >

            <div
              className="
                font-semibold
                mb-2
              "
            >
              Opening Builder
            </div>

            <div
              className="
                text-sm
                text-gray-500
              "
            >
              Create layout openings
            </div>

          </Link>

          <Link
            href="/admin/furniture-builder"
            className="
              border
              rounded-xl
              p-6
              hover:shadow-md
              transition
              bg-white
            "
          >

            <div
              className="
                font-semibold
                mb-2
              "
            >
              Furniture Builder
            </div>

            <div
              className="
                text-sm
                text-gray-500
              "
            >
              Assign beds,
              sofas and other furniture products
            </div>

          </Link>

                    <Link
            href="/admin/sunshine-builder"
            className="
              border
              rounded-xl
              p-6
              hover:shadow-md
              transition
              bg-white
            "
          >

            <div
              className="
                font-semibold
                mb-2
              "
            >
              Sunshine Builder
            </div>

            <div
              className="
                text-sm
                text-gray-500
              "
            >
              Assign curtain,
              track and blind products
            </div>

          </Link>

          <Link
            href="/admin/product-builder"
            className="
              border
              rounded-xl
              p-6
              hover:shadow-md
              transition
              bg-white
            "
          >

            <div
              className="
                font-semibold
                mb-2
              "
            >
              Product Builder
            </div>

            <div
              className="
                text-sm
                text-gray-500
              "
            >
              Assign furniture,
              and sunshince products
            </div>

          </Link>

          <Link
            href="/admin/package-editor"
            className="
              border
              rounded-xl
              p-6
              hover:shadow-md
              transition
              bg-white
            "
          >

            <div
              className="
                font-semibold
                mb-2
              "
            >
              Package Editor
            </div>

            <div
              className="
                text-sm
                text-gray-500
              "
            >
              Edit item and products
            </div>

          </Link>

          <Link
            href="/admin/product-editor"
            className="
              border
              rounded-xl
              p-6
              hover:shadow-md
              transition
              bg-white
            "
          >

            <div
              className="
                font-semibold
                mb-2
              "
            >
              Product Editor
            </div>

            <div
              className="
                text-sm
                text-gray-500
              "
            >
              Edit products and variants
            </div>

          </Link>

          <Link
            href="../listing"
            className="
              border
              rounded-xl
              p-6
              hover:shadow-md
              transition
              bg-white
            "
          >

            <div
              className="
                font-semibold
                mb-2
              "
            >
              Listing Import
            </div>

            <div
              className="
                text-sm
                text-gray-500
              "
            >
              Listing Import by one URL
            </div>

          </Link>

                    <Link
            href="/admin/listing"
            className="
              border
              rounded-xl
              p-6
              hover:shadow-md
              transition
              bg-white
            "
          >

            <div
              className="
                font-semibold
                mb-2
              "
            >
              Listing Sync
            </div>

            <div
              className="
                text-sm
                text-gray-500
              "
            >
              Auto Listing Import
            </div>

          </Link>          

        </div>

      </div>

    </div>

  )

}