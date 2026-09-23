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