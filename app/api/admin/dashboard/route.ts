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
      .select(
        "*",
        {
          count: "exact",
          head: true,
        }
      )

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
      .select(
        "*",
        {
          count: "exact",
          head: true,
        }
      )

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
      .select(
        "*",
        {
          count: "exact",
          head: true,
        }
      )

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
      .select(
        "*",
        {
          count: "exact",
          head: true,
        }
      )

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
      .select(
        "*",
        {
          count: "exact",
          head: true,
        }
      )

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
      .not(
        "visitor_id",
        "is",
        null
      )

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
      .not(
        "visitor_id",
        "is",
        null
      )

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
      .not(
        "visitor_id",
        "is",
        null
      )

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