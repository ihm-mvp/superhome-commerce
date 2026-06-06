import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(
  request: Request
) {

  try {

    const formData = await request.formData()

    const first_name =
      String(formData.get("first_name") || "").trim()

    const email =
      String(formData.get("email") || "").trim().toLowerCase()

    const package_id =
      String(formData.get("package_id") || "").trim()

    if (
      !first_name ||
      !email ||
      !package_id
    ) {

      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
        },
        {
          status: 400,
        }
      )

    }

    // =====================================
    // Find Existing User
    // =====================================

    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle()

    let userId = existingUser?.id

    // =====================================
    // Create User
    // =====================================

    if (!userId) {

      const { data: newUser, error } =
        await supabase
          .from("users")
          .insert({
            first_name,
            email,
          })
          .select("id")
          .single()

      if (error) {
        throw error
      }

      userId = newUser.id

    }

    // =====================================
    // Create Request Record
    // =====================================

    const { error: requestError } =
      await supabase
        .from("package_requests")
        .insert({
          user_id: userId,
          package_id,
        })

    if (requestError) {
      throw requestError
    }

    // =====================================
    // Success
    // =====================================

    return NextResponse.redirect(
      new URL(
        "/package-proposal-success",
        request.url
      )
    )

  } catch (error) {

    console.error(error)

    return NextResponse.json(
      {
        success: false,
        message: "Server error",
      },
      {
        status: 500,
      }
    )

  }

}