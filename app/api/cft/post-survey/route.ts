import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const endpoint =
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}` +
      "/functions/v1/cft-submit-post-survey";

    const apiKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !apiKey) {
      return NextResponse.json(
        { success: false, error: "Server configuration error." },
        { status: 500 }
      );
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("CFT Post Survey proxy error:", error);

    return NextResponse.json(
      { success: false, error: "Unable to submit. Please try again." },
      { status: 500 }
    );
  }
}