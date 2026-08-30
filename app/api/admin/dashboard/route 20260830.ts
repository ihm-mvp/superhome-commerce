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
    // Proposal Count
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
// Package and Proposal Views Count
// =========================

const {
  count: packageViews,
} = await supabase
  .from("package_views")
  .select("*", {
    count: "exact",
    head: true,
  })

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
    // Funnel Data
    // =========================

const {
  data: packageVisitorRows,
  error: packageVisitorError,
} = await supabase
  .from("package_views")
  .select("visitor_id")
  .not("visitor_id", "is", null)

if (packageVisitorError) {
  throw packageVisitorError
}

const uniqueVisitors =
  new Set(
    packageVisitorRows.map(
      (row: any) =>
        row.visitor_id
    )
  ).size

const {
  data: proposalVisitorRows,
  error: proposalVisitorError,
} = await supabase
  .from("package_request_views")
  .select("visitor_id")
  .not("visitor_id", "is", null)

if (proposalVisitorError) {
  throw proposalVisitorError
}

const uniqueProposalVisitors =
  new Set(
    proposalVisitorRows.map(
      (row: any) =>
        row.visitor_id
    )
  ).size

const {
  data: requestVisitorRows,
  error: requestVisitorError,
} = await supabase
  .from("package_requests")
  .select("visitor_id")
  .not("visitor_id", "is", null)

if (requestVisitorError) {
  throw requestVisitorError
}

const uniqueRequestVisitors =
  new Set(
    requestVisitorRows.map(
      (row: any) =>
        row.visitor_id
    )
  ).size

const packageToProposalRate =
  uniqueVisitors > 0
    ? (
        uniqueProposalVisitors /
        uniqueVisitors
      ) * 100
    : 0

const proposalToRequestRate =
  uniqueProposalVisitors > 0
    ? (
        uniqueRequestVisitors /
        uniqueProposalVisitors
      ) * 100
    : 0

const packageToRequestRate =
  uniqueVisitors > 0
    ? (
        uniqueRequestVisitors /
        uniqueVisitors
      ) * 100
    : 0

    // =========================
    // Return
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

  uniqueVisitors,

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