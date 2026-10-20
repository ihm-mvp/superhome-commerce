
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

    const missing: string[] = [];

    if (!url) missing.push("NEXT_PUBLIC_SUPABASE_URL");
    if (!anonKey) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
    if (!serviceKey) missing.push("SUPABASE_SERVICE_ROLE_KEY");

if (missing.length > 0) {
  const diagnostics = {
    missing,
    vercelEnv: process.env.VERCEL_ENV ?? null,
    vercelUrl: process.env.VERCEL_URL ?? null,
    productionUrl:
      process.env.VERCEL_PROJECT_PRODUCTION_URL ?? null,
    serviceKeyPresent:
      Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    serviceKeyLength:
      process.env.SUPABASE_SERVICE_ROLE_KEY?.length ?? 0,
  };

  console.error(
    "Supplier account environment diagnostics:",
    diagnostics
  );

  return NextResponse.json(
    {
      error: "Required environment variables are missing.",
      ...diagnostics,
    },
    { status: 500 }
  );
}

    // Narrow the environment variable types after validation.
    const supabaseUrl = url as string;
    const supabaseAnonKey = anonKey as string;
    const supabaseServiceKey = serviceKey as string;

    // Validate the caller's Supabase Auth session.
    const userClient = createClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        global: {
          headers: { Authorization: authorization },
        },
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

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
        {
          error:
            "Supplier/company name is missing from the account.",
        },
        { status: 400 }
      );
    }

    // Service role key is used only on the server.
    const admin = createClient(
      supabaseUrl,
      supabaseServiceKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

    // Avoid duplicate supplier records for the same Auth user.
    const {
      data: existing,
      error: lookupError,
    } = await admin
      .from("suppliers")
      .select("id, auth_user_id")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    if (lookupError) {
      throw lookupError;
    }

    if (existing) {
      return NextResponse.json({
        supplier_id: existing.id,
        existing: true,
      });
    }

    const {
      data: supplier,
      error: insertError,
    } = await admin
      .from("suppliers")
      .insert({
        name: companyName,
        auth_user_id: user.id,
      })
      .select("id")
      .single();

    if (insertError) {
      throw insertError;
    }

    return NextResponse.json(
      {
        supplier_id: supplier.id,
        existing: false,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
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