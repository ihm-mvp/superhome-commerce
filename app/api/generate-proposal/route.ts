import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest
) {

  try {

    const slug =
      request.nextUrl.searchParams.get("slug")

    if (!slug) {

      return NextResponse.json(
        {
          success: false,
          message: "Missing slug",
        },
        {
          status: 400,
        }
      )

    }

    const proposalUrl =

      `${process.env.NEXT_PUBLIC_SITE_URL}` +
      `/package-proposal/${slug}?pdf=1`

return NextResponse.json({
  proposalUrl,
})

    const response = await fetch(

      `https://production-sfo.browserless.io/pdf?token=${process.env.BROWSERLESS_API_KEY}`,

      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({

          url: proposalUrl,

          options: {

            format: "A4",

            printBackground: true,

            margin: {
              top: "12mm",
              right: "12mm",
              bottom: "12mm",
              left: "12mm",
            },

          },

        }),

      }

    )

    if (!response.ok) {

      const errorText =
        await response.text()

      console.error(
        "Browserless Error:",
        errorText
      )

      throw new Error(errorText)

    }

    const pdfBuffer =
      await response.arrayBuffer()

    return new NextResponse(
      pdfBuffer,
      {
        headers: {

          "Content-Type":
            "application/pdf",

          "Content-Disposition":
            `attachment; filename="${slug}-proposal.pdf"`,

        },
      }
    )

  } catch (error) {

    console.error(error)

    return NextResponse.json(
      {
        success: false,
        message:
          "PDF generation failed",

        error:
          error instanceof Error
            ? error.message
            : String(error),

      },
      {
        status: 500,
      }
    )

  }

}