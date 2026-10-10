import { supabase } from "@/lib/supabase"

const TIME_ZONE = "Pacific/Auckland"

function getNZDateString(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date)

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value])
  )

  return `${values.year}-${values.month}-${values.day}`
}

function addDays(dateString: string, days: number) {
  const [year, month, day] = dateString.split("-").map(Number)

  const date = new Date(
    Date.UTC(year, month - 1, day + days)
  )

  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0"),
  ].join("-")
}

// Convert midnight in New Zealand to a UTC timestamp.
// This also accounts for daylight saving time.
function getNZMidnightUTC(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number)

  const targetUTC = Date.UTC(year, month - 1, day)
  const guess = new Date(targetUTC)

  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(guess)

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value])
  )

  const representedUTC = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second)
  )

  return new Date(
    targetUTC + targetUTC - representedUTC
  ).toISOString()
}

function getPeriodRange(period: string) {
  const today = getNZDateString()

  if (period === "all") {
    return {
      startDate: null as string | null,
      startISO: null as string | null,
      endISO: null as string | null,
      today,
    }
  }

  const days =
    period === "7d" ? 7 :
    period === "90d" ? 90 :
    30

  const startDate = addDays(today, -(days - 1))
  const endDate = addDays(today, 1)

  return {
    startDate,
    startISO: getNZMidnightUTC(startDate),
    endISO: getNZMidnightUTC(endDate),
    today,
  }
}

function getEventDate(timestamp: string) {
  return getNZDateString(new Date(timestamp))
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const requestedPeriod = searchParams.get("period") || "30d"

    const period = ["7d", "30d", "90d", "all"].includes(
      requestedPeriod
    )
      ? requestedPeriod
      : "30d"

    const {
      startDate,
      startISO,
      endISO,
      today,
    } = getPeriodRange(period)

    // =========================
    // Subscribers Count: All Time
    // =========================

    const {
      count: subscribers,
      error: subscribersError,
    } = await supabase
      .from("email_subscriptions")
      .select("*", {
        count: "exact",
        head: true,
      })

    if (subscribersError) throw subscribersError

    // =========================
    // Users Count: All Time
    // =========================

    const {
      count: users,
      error: usersError,
    } = await supabase
      .from("users")
      .select("*", {
        count: "exact",
        head: true,
      })

    if (usersError) throw usersError

    // =========================
    // Package Views Count
    // Apply Selected Period
    // =========================

    let packageViewsQuery = supabase
      .from("package_views")
      .select("*", {
        count: "exact",
        head: true,
      })

    if (startISO) {
      packageViewsQuery = packageViewsQuery.gte(
        "viewed_at",
        startISO
      )
    }

    if (endISO) {
      packageViewsQuery = packageViewsQuery.lt(
        "viewed_at",
        endISO
      )
    }

    const {
      count: packageViews,
      error: packageViewsError,
    } = await packageViewsQuery

    if (packageViewsError) throw packageViewsError

    // =========================
    // Proposal Requests Count
    // Apply Selected Period
    // =========================

    let proposalsQuery = supabase
      .from("package_requests")
      .select("*", {
        count: "exact",
        head: true,
      })

    if (startISO) {
      proposalsQuery = proposalsQuery.gte(
        "created_at",
        startISO
      )
    }

    if (endISO) {
      proposalsQuery = proposalsQuery.lt(
        "created_at",
        endISO
      )
    }

    const {
      count: proposals,
      error: proposalsError,
    } = await proposalsQuery

    if (proposalsError) throw proposalsError

    // =========================
    // Package View Data
    // =========================

    let packageViewQuery = supabase
      .from("package_views")
      .select(`
        package_id,
        visitor_id,
        viewed_at
      `)

    if (startISO) {
      packageViewQuery = packageViewQuery.gte(
        "viewed_at",
        startISO
      )
    }

    if (endISO) {
      packageViewQuery = packageViewQuery.lt(
        "viewed_at",
        endISO
      )
    }

    const {
      data: packageViewRows,
      error: packageViewRowsError,
    } = await packageViewQuery

    if (packageViewRowsError) {
      throw packageViewRowsError
    }

    // =========================
    // Package Request Data
    // =========================

    let packageRequestQuery = supabase
      .from("package_requests")
      .select(`
        package_id,
        visitor_id,
        created_at
      `)

    if (startISO) {
      packageRequestQuery = packageRequestQuery.gte(
        "created_at",
        startISO
      )
    }

    if (endISO) {
      packageRequestQuery = packageRequestQuery.lt(
        "created_at",
        endISO
      )
    }

    const {
      data: packageRequestRows,
      error: packageRequestRowsError,
    } = await packageRequestQuery

    if (packageRequestRowsError) {
      throw packageRequestRowsError
    }

    const viewsData = packageViewRows || []
    const requestsData = packageRequestRows || []

    // =========================
    // Unique Visitors
    // Within Selected Period
    // =========================

    const uniquePackageVisitors = new Set(
      viewsData
        .map((row) => row.visitor_id)
        .filter(Boolean)
    ).size

    const uniqueRequestVisitors = new Set(
      requestsData
        .map((row) => row.visitor_id)
        .filter(Boolean)
    ).size

    const packageToRequestRate =
      uniquePackageVisitors > 0
        ? Number(
            (
              uniqueRequestVisitors /
              uniquePackageVisitors *
              100
            ).toFixed(1)
          )
        : 0

    // =========================
    // Package List
    // =========================

    const {
      data: packageList,
      error: packageListError,
    } = await supabase
      .from("packages")
      .select(`
        id,
        name,
        slug,
        sort_order,
        layout:layouts!packages_layout_id_fkey(
          name,
          location
        )
      `)
      .order("sort_order", {
        ascending: true,
      })

    if (packageListError) throw packageListError

    // =========================
    // Package Performance
    // Within Selected Period
    // =========================

    const packagePerformance = (packageList || []).map(
      (pkg: any) => {
        const views = viewsData.filter(
          (row) => row.package_id === pkg.id
        )

        const requests = requestsData.filter(
          (row) => row.package_id === pkg.id
        )

        const uniqueVisitors = new Set(
          views
            .map((row) => row.visitor_id)
            .filter(Boolean)
        ).size

        const uniquePackageRequestVisitors = new Set(
          requests
            .map((row) => row.visitor_id)
            .filter(Boolean)
        ).size

        const viewToRequestRate =
          uniqueVisitors > 0
            ? Number(
                (
                  uniquePackageRequestVisitors /
                  uniqueVisitors *
                  100
                ).toFixed(1)
              )
            : 0

        const layout = Array.isArray(pkg.layout)
          ? pkg.layout[0]
          : pkg.layout

        return {
          id: pkg.id,
          name: pkg.name,
          slug: pkg.slug,
          layoutName: layout?.name || "",
          layoutLocation: layout?.location || "",
          views: views.length,
          uniqueVisitors,
          requests: requests.length,
          viewToRequestRate,
        }
      }
    )

       // =========================
    // Daily Trend
    // =========================

    const eventDates = [
      ...viewsData.map((row) => row.viewed_at),
      ...requestsData.map((row) => row.created_at),
    ]
      .filter(Boolean)
      .map((timestamp) => getEventDate(timestamp))

    const firstEventDate =
      eventDates.length > 0
        ? eventDates.reduce((earliest, date) =>
            date < earliest ? date : earliest
          )
        : today

    const trendStartDate =
      startDate && startDate > firstEventDate
        ? startDate
        : firstEventDate

    const trend = []

    for (
      let date = trendStartDate;
      date <= today;
      date = addDays(date, 1)
    ) {
      const views = viewsData.filter(
        (row) => getEventDate(row.viewed_at) === date
      ).length

      const requests = requestsData.filter(
        (row) => getEventDate(row.created_at) === date
      ).length

      trend.push({
        date,
        views,
        requests,
      })
    }

    // =========================
    // Latest Request: Unfiltered
    // =========================

    const {
      data: latestRequest,
      error: latestRequestError,
    } = await supabase
      .from("package_requests")
      .select(`
        id,
        created_at,
        user:users(
          first_name,
          email
        ),
        package:packages(
          name,
          slug,
          layout:layouts!packages_layout_id_fkey(
            name,
            location
          )
        )
      `)
      .order("created_at", {
        ascending: false,
      })
      .limit(1)
      .maybeSingle()

    if (latestRequestError) throw latestRequestError

    // =========================
    // Latest Package View: Unfiltered
    // =========================

    const {
      data: latestPackageView,
      error: latestPackageViewError,
    } = await supabase
      .from("package_views")
      .select(`
        id,
        package_id,
        visitor_id,
        lead_source,
        viewed_at,
        package:packages(
          name,
          slug,
          layout:layouts!packages_layout_id_fkey(
            name,
            location
          )
        )
      `)
      .order("viewed_at", {
        ascending: false,
      })
      .limit(1)
      .maybeSingle()

    if (latestPackageViewError) {
      throw latestPackageViewError
    }

    // =========================
    // Response
    // =========================

    return Response.json({
      period,

      subscribers: subscribers || 0,
      users: users || 0,

      packageViews: packageViews || 0,
      proposals: proposals || 0,

      uniquePackageVisitors,
      uniqueRequestVisitors,
      packageToRequestRate,

      packagePerformance,
      trend,

      latestRequest: latestRequest || null,
      latestPackageView: latestPackageView || null,
    })
  } catch (error: any) {
    console.error("Dashboard Error:", error)

    return Response.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    )
  }
}