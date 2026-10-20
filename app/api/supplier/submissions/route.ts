import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getUserClient(request: NextRequest) {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) return null;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase environment variables are missing.");
  return createClient(url, key, { global: { headers: { Authorization: authorization } } });
}

async function getClients(request: NextRequest) {
  const authClient = getUserClient(request);
  if (!authClient) return null;
  const { data: { user }, error: authError } = await authClient.auth.getUser();
  if (authError || !user) return { authClient, db: null, user: null, supplierId: null };
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY must be configured server-side for submission writes.");
  const db = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: supplier, error } = await db.from("suppliers").select("id").eq("auth_user_id", user.id).maybeSingle();
  if (error) throw error;
  return { authClient, db, user, supplierId: supplier?.id ?? null };
}

export async function GET(request: NextRequest) {
  try {
    const clients = await getClients(request);
    if (!clients) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    if (!clients.user) return NextResponse.json({ error: "Invalid session." }, { status: 401 });
    const { db, supplierId } = clients;
    if (!db || !supplierId) return NextResponse.json({ error: "This account is not linked to a supplier." }, { status: 403 });
    const { data, error } = await db
      .from("product_submissions")
      .select("id,status,payload,image_urls,review_note,created_at,updated_at,published_product_id")
      .eq("supplier_id", supplierId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return NextResponse.json({ submissions: data ?? [] });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load submissions." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const clients = await getClients(request);
    if (!clients) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    if (!clients.user) return NextResponse.json({ error: "Invalid session." }, { status: 401 });
    const { db, supplierId } = clients;
    if (!db || !supplierId) return NextResponse.json({ error: "This account is not linked to a supplier." }, { status: 403 });

    const body = await request.json();
    const payload = body?.payload;
    const imageUrls = Array.isArray(body?.image_urls) ? body.image_urls.filter((v: unknown) => typeof v === "string") : [];
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      return NextResponse.json({ error: "Product payload is required." }, { status: 400 });
    }
    const sku = typeof payload.sku_code === "string" ? payload.sku_code.trim() : "";
    const name = typeof payload.name === "string" ? payload.name.trim() : "";
    if (!sku || !name) return NextResponse.json({ error: "SKU and product name are required." }, { status: 400 });
    if (sku.length > 120 || name.length > 300) return NextResponse.json({ error: "SKU or product name is too long." }, { status: 400 });
    if (imageUrls.length > 20) return NextResponse.json({ error: "A maximum of 20 images is allowed." }, { status: 400 });

    // Prevent duplicate pending submissions by the same supplier; published SKU uniqueness is checked again during review.
    const { data: duplicate, error: duplicateError } = await db
      .from("product_submissions")
      .select("id")
      .eq("supplier_id", supplierId)
      .in("status", ["submitted", "needs_revision", "approved", "published"])
      .ilike("payload->>sku_code", sku)
      .limit(1);
    if (duplicateError) throw duplicateError;
    if (duplicate?.length) return NextResponse.json({ error: "A submission for this SKU already exists." }, { status: 409 });

    const { data, error } = await db
      .from("product_submissions")
      .insert({ supplier_id: supplierId, payload, image_urls: imageUrls, status: "submitted" })
      .select("id,status,created_at")
      .single();
    if (error) throw error;
    return NextResponse.json({ submission: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to submit product." }, { status: 500 });
  }
}
