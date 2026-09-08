import { supabase } from "@/lib/supabase"

export async function GET() {

  try {

    // =========================
    // Subscribers Count
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

    if (subscribersError) {
      throw subscribersError
    }

    // =========================
    // Users Count
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

    if (usersError) {
      throw usersError
    }

    // =========================
    // Proposal Requests Count
    // =========================

    const {
      count: proposals,
      error: proposalsError,
    } = await supabase
      .from("package_requests")
      .select("*", {
        count: "exact",
        head: true,
      })

    if (proposalsError) {
      throw proposalsError
    }

    // =========================
    // Package Views Count
    // =========================

    const {
      count: packageViews,
      error: packageViewsError,
    } = await supabase
      .from("package_views")
      .select("*", {
        count: "exact",
        head: true,
      })

    if (packageViewsError) {
      throw packageViewsError
    }

    // =========================
    // Proposal Views Count
    // =========================

    const {
      count: proposalViews,
      error: proposalViewsError,
    } = await supabase
      .from("package_request_views")
      .select("*", {
        count: "exact",
        head: true,
      })

    if (proposalViewsError) {
      throw proposalViewsError
    }

    // =========================
    // Unique Package Visitors
    // =========================

    const {
      data: packageVisitorRows,
      error: packageVisitorsError,
    } = await supabase
      .from("package_views")
      .select("visitor_id")
      .not("visitor_id", "is", null)

    if (packageVisitorsError) {
      throw packageVisitorsError
    }

    const uniquePackageVisitors =
      new Set(
        packageVisitorRows?.map(
          (row) => row.visitor_id
        ) || []
      ).size

    // =========================
    // Unique Proposal Visitors
    // =========================

    const {
      data: proposalVisitorRows,
      error: proposalVisitorsError,
    } = await supabase
      .from("package_request_views")
      .select("visitor_id")
      .not("visitor_id", "is", null)

    if (proposalVisitorsError) {
      throw proposalVisitorsError
    }

    const uniqueProposalVisitors =
      new Set(
        proposalVisitorRows?.map(
          (row) => row.visitor_id
        ) || []
      ).size

    // =========================
    // Unique Request Visitors
    // =========================

    const {
      data: requestVisitorRows,
      error: requestVisitorsError,
    } = await supabase
      .from("package_requests")
      .select("visitor_id")
      .not("visitor_id", "is", null)

    if (requestVisitorsError) {
      throw requestVisitorsError
    }

    const uniqueRequestVisitors =
      new Set(
        requestVisitorRows?.map(
          (row) => row.visitor_id
        ) || []
      ).size

    // =========================
    // Conversion Funnel Rates
    // =========================

    const packageToProposalRate =
      uniquePackageVisitors > 0
        ? Number(
            (
              uniqueProposalVisitors /
              uniquePackageVisitors *
              100
            ).toFixed(1)
          )
        : 0

    const proposalToRequestRate =
      uniqueProposalVisitors > 0
        ? Number(
            (
              uniqueRequestVisitors /
              uniqueProposalVisitors *
              100
            ).toFixed(1)
          )
        : 0

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
    // Package Performance
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
      .order(
        "sort_order",
        {
          ascending: true,
        }
      )

    if (packageListError) {
      throw packageListError
    }

// =========================
    // Package View Data
    // =========================

    const {
      data: packageViewRows,
      error: packageViewRowsError,
    } = await supabase
      .from("package_views")
      .select(`
        package_id,
        visitor_id
      `)

    if (packageViewRowsError) {
      throw packageViewRowsError
    }

    // =========================
    // Package Proposal View Data
    // =========================

    const {
      data: packageProposalRows,
      error: packageProposalRowsError,
    } = await supabase
      .from("package_request_views")
      .select(`
        package_id,
        visitor_id
      `)

    if (packageProposalRowsError) {
      throw packageProposalRowsError
    }

    // =========================
    // Package Request Data
    // =========================

    const {
      data: packageRequestRows,
      error: packageRequestRowsError,
    } = await supabase
      .from("package_requests")
      .select(`
        package_id,
        visitor_id
      `)

    if (packageRequestRowsError) {
      throw packageRequestRowsError
    }

    // =========================
    // Build Package Performance
    // =========================

    const packagePerformance =
      (packageList || []).map(
        (pkg: any) => {

          const views =
            (packageViewRows || [])
              .filter(
                (row: any) =>
                  row.package_id === pkg.id
              )

          const proposalViewsForPackage =
            (packageProposalRows || [])
              .filter(
                (row: any) =>
                  row.package_id === pkg.id
              )

          const requests =
            (packageRequestRows || [])
              .filter(
                (row: any) =>
                  row.package_id === pkg.id
              )

          const uniqueVisitors =
            new Set(
              views
                .map(
                  (row: any) =>
                    row.visitor_id
                )
                .filter(Boolean)
            ).size

          const uniqueProposalVisitors =
            new Set(
              proposalViewsForPackage
                .map(
                  (row: any) =>
                    row.visitor_id
                )
                .filter(Boolean)
            ).size

          const uniqueRequestVisitors =
            new Set(
              requests
                .map(
                  (row: any) =>
                    row.visitor_id
                )
                .filter(Boolean)
            ).size

          const viewToProposalRate =
            uniqueVisitors > 0
              ? Number(
                  (
                    uniqueProposalVisitors /
                    uniqueVisitors *
                    100
                  ).toFixed(1)
                )
              : 0

          const viewToRequestRate =
            uniqueVisitors > 0
              ? Number(
                  (
                    uniqueRequestVisitors /
                    uniqueVisitors *
                    100
                  ).toFixed(1)
                )
              : 0

const layout =
  Array.isArray(pkg.layout)
    ? pkg.layout[0]
    : pkg.layout

return {

  id:
    pkg.id,

  name:
    pkg.name,

  slug:
    pkg.slug,

  layoutName:
    layout?.name || "",

  layoutLocation:
    layout?.location || "",

  views:
    views.length,

            uniqueVisitors,

            proposalViews:
              proposalViewsForPackage.length,

            requests:
              requests.length,

            viewToProposalRate,

            viewToRequestRate,

          }

        }
      )

    // =========================
    // Recent Proposals
    // =========================

    const {
      data: recentProposals,
      error: recentError,
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
          slug
        )
      `)
      .order(
        "created_at",
        {
          ascending: false,
        }
      )
      .limit(10)

    if (recentError) {
      throw recentError
    }

    // =========================
    // Response
    // =========================

    return Response.json({

      subscribers:
        subscribers || 0,

      users:
        users || 0,

      packageViews:
        packageViews || 0,

      proposalViews:
        proposalViews || 0,

      proposals:
        proposals || 0,

      uniquePackageVisitors,

      uniqueProposalVisitors,

      uniqueRequestVisitors,

      packageToProposalRate,

      proposalToRequestRate,

      packageToRequestRate,

      packagePerformance,

      recentProposals:
        recentProposals || [],

    })

  } catch (error: any) {

    console.error(
      "Dashboard Error:",
      error
    )

    return Response.json(
      {
        error:
          error.message,
      },
      {
        status: 500,
      }
    )
  }
}