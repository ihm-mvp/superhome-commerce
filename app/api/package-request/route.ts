import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { Resend } from "resend"
import ProposalEmail
from "@/app/emails/ProposalEmail"

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

// 小测试
const {
  data: pkg,
  error: packageError,
} = await supabase
  .from("packages")
  .select("slug")
  .eq("id", package_id)
  .single()

if (packageError || !pkg) {
  throw new Error("Package not found")
}

console.log(pkg.slug)

    // =====================================
    // Success
    // =====================================

    //小测试
const pdfResponse =
  await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/generate-proposal?slug=${pkg.slug}`
  )

console.log(
  "PDF Status:",
  pdfResponse.status
)

const pdfBuffer =
  Buffer.from(
    await pdfResponse.arrayBuffer()
  )

console.log(
  "PDF Size:",
  pdfBuffer.length
)

console.log(
  "RESEND_API_KEY:",
  !!process.env.RESEND_API_KEY
)

console.log(
  "EMAIL_FROM:",
  !!process.env.EMAIL_FROM
)

const apiKey =
  process.env.RESEND_API_KEY

const fromEmail =
  process.env.EMAIL_FROM

if (!apiKey || !fromEmail) {
  throw new Error(
    "Resend not configured"
  )
}

const resend =
  new Resend(apiKey)

await resend.emails.send({

  from:
    `MoveInReady <${fromEmail}>`,

  to: email,

  subject:
    `MoveInReady | ${pkg.slug
      .replace(/-/g, " ")
      .replace(/\b\w/g, c => c.toUpperCase())
    } Package Proposal`,

  react: ProposalEmail({
    firstName: first_name,
  }),

  attachments: [

    {
      filename:
        `MoveInReady-${pkg.slug}-Package-Proposal.pdf`,

      content:
        pdfBuffer.toString(
          "base64"
        ),
    },

  ],

})

console.log(
  "Proposal Email Sent"
)

console.log(
  "Proposal Email Sent"
)

return NextResponse.redirect(
  new URL(
    "/package-proposal-success",
    request.url
  ),
  {
    status: 303,
  }
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