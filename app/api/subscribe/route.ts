export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { Resend } from "resend"
import WelcomeEmail from "@/app/emails/WelcomeEmail 20260430" // ✅ 新增

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const email: string = body.email?.trim().toLowerCase()
    const source: string = body.source || "unknown"

    // ===== 1️⃣ 基础校验 =====
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
      insertError.message &&
      insertError.message.toLowerCase().includes("duplicate")

    if (insertError && !isDuplicate) {
      console.error("DB error:", insertError)

      return NextResponse.json(
        { error: "Database error" },
        { status: 500 }
      )
    }

    // ===== 3️⃣ 检查环境变量 =====
    const apiKey = process.env.RESEND_API_KEY
    const fromEmail = process.env.EMAIL_FROM

    if (!apiKey || !fromEmail) {
      console.error("Missing env:", {
        RESEND_API_KEY: !!apiKey,
        EMAIL_FROM: !!fromEmail,
      })

      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      )
    }

    // ===== 4️⃣ 初始化 Resend =====
    const resend = new Resend(apiKey)

    // ===== 5️⃣ 发邮件（仅新用户）=====
    if (!isDuplicate) {
      try {
        await resend.emails.send({
          from: `MoveInReady <${fromEmail}>`,
          to: email,
          subject: "Welcome to MoveInReady",
          react: WelcomeEmail(), // ✅ 用组件
        })
      } catch (emailError) {
        console.error("Email send failed:", emailError)
        // 👉 不阻断主流程（用户仍然算订阅成功）
      }
    }

    // ===== 6️⃣ 返回 =====
    return NextResponse.json({
      success: true,
      duplicate: !!isDuplicate,
    })

  } catch (err) {
    console.error("Subscribe API error:", err)

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}