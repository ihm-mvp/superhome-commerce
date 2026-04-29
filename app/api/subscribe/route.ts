import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const email: string = body.email?.trim().toLowerCase()
    const source: string = body.source || "unknown"

    // ===== 1️⃣ 基础校验 =====
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    if (!email.includes("@")) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // ===== 2️⃣ 写入数据库 =====
    const { error: insertError } = await supabase
      .from("email_subscribers")
      .insert([
        {
          email,
          source,
        },
      ])

    // 👉 如果是重复（unique constraint），忽略错误
    const isDuplicate =
      insertError &&
      insertError.message &&
      insertError.message.toLowerCase().includes("duplicate")

    if (insertError && !isDuplicate) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      )
    }

    // ===== 3️⃣ 发送欢迎邮件（只在非重复时发）=====
    if (!isDuplicate) {
      try {
        await resend.emails.send({
          from: `MoveInReady <${process.env.EMAIL_FROM}>`,
          to: email,
          subject: "Welcome to MoveInReady",
          html: `
            <div style="font-family:Arial, sans-serif; line-height:1.6;">
              <h2>Welcome to MoveInReady</h2>

              <p>
                Thanks for joining us.
              </p >

              <p>
                You’ll be the first to receive:
              </p >

              <ul>
                <li>New home layouts</li>
                <li>Furniture packages</li>
                <li>Move-in ready solutions</li>
              </ul>

              <p>
                Explore now:
              </p >

              <p>
                <a href=" "
                   style="display:inline-block;padding:10px 16px;background:#000;color:#fff;text-decoration:none;border-radius:6px;">
                   View Packages
                </a >
              </p >

              <hr style="margin:30px 0;" />

              <p style="font-size:12px;color:#666;">
                MoveInReady<br/>
                Operated by SuperMilkBaba (NZ) Limited<br/>
                Christchurch, New Zealand
              </p >
            </div>
          `,
        })
      } catch (emailError) {
        // 邮件失败不影响主流程
        console.error("Email send failed:", emailError)
      }
    }

    // ===== 4️⃣ 返回成功 =====
    return NextResponse.json({
      success: true,
      duplicate: isDuplicate || false,
    })
  } catch (err) {
    console.error("Subscribe API error:", err)

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}