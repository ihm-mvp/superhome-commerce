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

    return Response.json({

      subscribers:
        subscribers || 0,

      users:
        users || 0,

      proposals:
        proposals || 0,

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