
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const authorization = request.headers.get("authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Sign in required." },
        { status: 401 }
      );
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !anonKey || !serviceKey) {
      return NextResponse.json(
        { error: "Required Supabase environment variables are missing." },
        { status: 500 }
      );
    }

    // Validate the caller's Supabase Auth session.
    const userClient = createClient(url, anonKey, {
      global: {
        headers: { Authorization: authorization },
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Invalid session." },
        { status: 401 }
      );
    }

    // Only accounts registered as suppliers may create supplier profiles.
    if (user.user_metadata?.account_type !== "supplier") {
      return NextResponse.json(
        { error: "This account is not registered as a supplier." },
        { status: 403 }
      );
    }

    const companyName =
      typeof user.user_metadata?.company_name === "string"
        ? user.user_metadata.company_name.trim()
        : "";

    if (!companyName) {
      return NextResponse.json(
        { error: "Supplier/company name is missing from the account." },
        { status: 400 }
      );
    }

    // Use the service role key only on the server.
    const admin = createClient(url, serviceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    // Avoid creating duplicate supplier records for the same Auth user.
    const { data: existing, error: lookupError } = await admin
      .from("suppliers")
      .select("id, auth_user_id")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    if (lookupError) throw lookupError;

    if (existing) {
      return NextResponse.json({
        supplier_id: existing.id,
        existing: true,
      });
    }

    const { data: supplier, error: insertError } = await admin
      .from("suppliers")
      .insert({
        name: companyName,
        auth_user_id: user.id,
      })
      .select("id")
      .single();

    if (insertError) throw insertError;

    return NextResponse.json(
      {
        supplier_id: supplier.id,
        existing: false,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Supplier account setup failed:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create supplier profile.",
      },
      { status: 500 }
    );
  }
}