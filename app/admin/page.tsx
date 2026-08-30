"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

export default function AdminDashboard() {

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    stats,
    setStats,
  ] = useState<any>({
    subscribers: 0,
    users: 0,
    packageViews: 0,
    proposalViews: 0,

uniqueVisitors: 0,

uniqueProposalVisitors: 0,

uniqueRequestVisitors: 0,

packageToProposalRate: 0,

proposalToRequestRate: 0,

packageToRequestRate: 0,

    proposals: 0,
    recentProposals: [],
  })

  useEffect(() => {

    loadDashboard()

  }, [])

  async function loadDashboard() {

    try {

      const res =
        await fetch(
          "/api/admin/dashboard"
        )

      const data =
        await res.json()

      setStats(data)

    } catch (error) {

      console.error(error)

    } finally {

      setLoading(false)

    }

  }

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
          Latest Proposal Requests
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

            {stats.recentProposals
              ?.length === 0 && (

              <div
                className="
                  text-gray-400
                "
              >
                No proposal requests
              </div>

            )}

            {stats.recentProposals
  ?.slice(0, 9)
  .map(
                (
                  item: any
                ) => (

                  <div
                    key={item.id}
                    className="
                      border
                      rounded-lg
                      p-4
                      flex
                      justify-between
                      items-center
                    "
                  >

                    <div
                      className="
                        space-y-1
                      "
                    >

                      <div
                        className="
                          font-medium
                        "
                      >
                        {
                          item.user
                            ?.first_name
                        }
                      </div>

                      <div
                        className="
                          text-sm
                          text-gray-500
                        "
                      >
                        {
                          item.user
                            ?.email
                        }
                      </div>

                    </div>

                    <div
                      className="
                        text-right
                      "
                    >

                      <div
                        className="
                          font-medium
                        "
                      >
                        {
                          item.package
                            ?.name
                        }
                      </div>

                      <div
                        className="
                          text-xs
                          text-gray-400
                        "
                      >
                        {
                          item.created_at
                            ?.substring(
                              0,
                              10
                            )
                        }
                      </div>

                    </div>

                  </div>

                )
              )}

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
    Proposal Views
  </div>

  <div
    className="
      text-3xl
      font-semibold
      mt-2
    "
  >
    {stats.proposalViews}
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

          {/* ===== Funnel Visitors ===== */}

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
                {stats.uniquePackageVisitors}
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
                Unique Proposal Visitors
              </div>

              <div
                className="
                  text-3xl
                  font-semibold
                  mt-1
                "
              >
                {stats.uniqueProposalVisitors}
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
                {stats.uniqueRequestVisitors}
              </div>

            </div>

          </div>

          {/* ===== Conversion Rates ===== */}

          <div
            className="
              border-t
              mt-8
              pt-6
              grid
              md:grid-cols-3
              gap-6
              text-center
            "
          >

            <div>

              <div
                className="
                  text-sm
                  text-gray-500
                "
              >
                Package → Proposal
              </div>

              <div
                className="
                  text-2xl
                  font-semibold
                  mt-2
                "
              >
                {stats.packageToProposalRate}%
              </div>

            </div>

            <div>

              <div
                className="
                  text-sm
                  text-gray-500
                "
              >
                Proposal → Request
              </div>

              <div
                className="
                  text-2xl
                  font-semibold
                  mt-2
                "
              >
                {stats.proposalToRequestRate}%
              </div>

            </div>

            <div>

              <div
                className="
                  text-sm
                  text-gray-500
                "
              >
                Package → Request
              </div>

              <div
                className="
                  text-2xl
                  font-semibold
                  mt-2
                "
              >
                {stats.packageToRequestRate}%
              </div>

            </div>

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