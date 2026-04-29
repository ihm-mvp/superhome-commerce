export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { Resend } from "resend"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const email: string = body.email?.trim().toLowerCase()
    const source: string = body.source || "unknown"

    // ===== 1️⃣ 校验 =====
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Invalid email" },
        { status: 400 }
      )
    }

    // ===== 2️⃣ 写数据库 =====
    const { error: insertError } = await supabase
      .from("email_subscribers")
      .insert([{ email, source }])

    const isDuplicate =
      insertError &&
      insertError.message?.toLowerCase().includes("duplicate")

    if (insertError && !isDuplicate) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      )
    }

    // ===== 3️⃣ 初始化 Resend（🔥关键：移到这里）=====
    const resend = new Resend(process.env.RESEND_API_KEY)

    // ===== 4️⃣ 发邮件 =====
    if (!isDuplicate) {
      try {
        await resend.emails.send({
          from: `MoveInReady <${process.env.EMAIL_FROM}>`,
          to: email,
          subject: "Welcome to MoveInReady",
          html: `<p>Welcome to MoveInReady</p >`,
        })
      } catch (err) {
        console.error("Email error:", err)
      }
    }

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}