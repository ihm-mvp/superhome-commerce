import {
  NextResponse,
} from "next/server"

import {
  supabase,
} from "@/lib/supabase"

export async function POST(
  req: Request
) {

  try {

    const {
      package_id,
      lead_source,
      visitor_id,
      referrer,
      user_agent,
    } = await req.json()

    // =========================
// Test Visitor Whitelist
// =========================

const TEST_VISITOR_IDS = new Set([
  "6a14cce3-31fb-48da-8273-e498861271f4",
  "c1ca2b39-a3d7-476e-95da-e21ba0a1297e",
])

if (
  visitor_id &&
  TEST_VISITOR_IDS.has(visitor_id)
) {
  return NextResponse.json({
    success: true,
    tracked: false,
  })
}

    const {
      error,
    } = await supabase
      .from("package_views")
      .insert({
        package_id,
        lead_source,
        visitor_id,
        referrer,
        user_agent,
      })

    if (error) {

      throw error

    }

    return NextResponse.json({
      success: true,
    })

  } catch (error: any) {

    return NextResponse.json(
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