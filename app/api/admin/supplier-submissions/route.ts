import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function adminClient(request: NextRequest) {
  const expected = process.env.MIR_SUPPLIER_REVIEW_SECRET;
  const supplied = request.headers.get("x-review-secret");
  if (!expected || !supplied || supplied !== expected) return null;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Set SUPABASE_SERVICE_ROLE_KEY on the server before enabling review/publishing.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function GET(request: NextRequest) {
  try {
    const client = adminClient(request);
    if (!client) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    const status = request.nextUrl.searchParams.get("status") || "submitted";
    const allowed = ["submitted", "needs_revision", "approved", "rejected", "published"];
    if (!allowed.includes(status)) return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    const { data, error } = await client.from("product_submissions")
      .select("*,supplier:suppliers(id,name)").eq("status", status).order("created_at", { ascending: true });
    if (error) throw error;
    return NextResponse.json({ submissions: data ?? [] });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load submissions." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = adminClient(request);
    if (!client) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    const body = await request.json();
    const id = typeof body?.id === "string" ? body.id : "";
    const action = body?.action;
    const reviewNote = typeof body?.review_note === "string" ? body.review_note.slice(0, 5000) : null;
    if (!id || !["needs_revision", "reject", "publish"].includes(action)) return NextResponse.json({ error: "Valid id and action are required." }, { status: 400 });

    const { data: submission, error: loadError } = await client.from("product_submissions").select("*").eq("id", id).single();
    if (loadError || !submission) return NextResponse.json({ error: loadError?.message || "Submission not found." }, { status: 404 });
    if (submission.status === "published") return NextResponse.json({ error: "Submission is already published." }, { status: 409 });

    if (action === "needs_revision" || action === "reject") {
      const status = action === "reject" ? "rejected" : "needs_revision";
      const { error } = await client.from("product_submissions").update({ status, review_note: reviewNote, reviewed_at: new Date().toISOString() }).eq("id", id);
      if (error) throw error;
      return NextResponse.json({ success: true, status });
    }

    const p = submission.payload as Record<string, any>;
    const sku = typeof p.sku_code === "string" ? p.sku_code.trim() : "";
    const name = typeof p.name === "string" ? p.name.trim() : "";
    if (!sku || !name) return NextResponse.json({ error: "Submission must include SKU and product name." }, { status: 400 });
    const { data: existing, error: duplicateError } = await client.from("products").select("id").ilike("sku_code", sku).limit(1);
    if (duplicateError) throw duplicateError;
    if (existing?.length) return NextResponse.json({ error: `SKU ${sku} already exists in products. Resolve the duplicate before publishing.` }, { status: 409 });
    const categoryId = typeof p.category_id === "string" && p.category_id ? p.category_id : null;
    if (categoryId) {
      const { data: category, error } = await client.from("categories").select("id").eq("id", categoryId).maybeSingle();
      if (error) throw error;
      if (!category) return NextResponse.json({ error: "The submitted category does not exist." }, { status: 400 });
    }

    const imageUrls: string[] = Array.isArray(submission.image_urls) ? submission.image_urls.filter((v: unknown) => typeof v === "string") : [];
    const { data: product, error: productError } = await client.from("products").insert({
      supplier_id: submission.supplier_id, category_id: categoryId, sku_code: sku, name,
      display_name_en: typeof p.display_name_en === "string" && p.display_name_en ? p.display_name_en : name,
      description: typeof p.description === "string" ? p.description : null,
      display_description_en: typeof p.display_description_en === "string" ? p.display_description_en : null,
      image_url: imageUrls[0] ?? null,
    }).select("id").single();
    if (productError) throw productError;

    const variants = Array.isArray(p.variants) ? p.variants : [];
    if (variants.length) {
      const rows = variants.map((v: Record<string, any>) => ({
        product_id: product.id,
        size_label: typeof v.size_label === "string" ? v.size_label : null,
        width_mm: Number.isFinite(v.width_mm) ? v.width_mm : null,
        length_mm: Number.isFinite(v.length_mm) ? v.length_mm : null,
        height_mm: Number.isFinite(v.height_mm) ? v.height_mm : null,
        price_rmb: Number.isFinite(v.price_rmb) ? v.price_rmb : null,
        config: typeof v.config === "string" ? v.config : null,
        note: typeof v.note === "string" ? v.note : null,
      }));
      const { error } = await client.from("variants").insert(rows);
      if (error) {
        // Compensate for the product insert if variant creation fails.
        await client.from("products").delete().eq("id", product.id);
        throw error;
      }
    }
    if (imageUrls.length) {
      const { error } = await client.from("product_images").insert(imageUrls.map((image_url, index) => ({ product_id: product.id, image_url, sort_order: index + 1 })));
      if (error) {
        await client.from("variants").delete().eq("product_id", product.id);
        await client.from("products").delete().eq("id", product.id);
        throw error;
      }
    }
    const { error: updateError } = await client.from("product_submissions").update({ status: "published", review_note: reviewNote, reviewed_at: new Date().toISOString(), published_product_id: product.id }).eq("id", id);
    if (updateError) throw updateError;
    return NextResponse.json({ success: true, status: "published", product_id: product.id });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Review action failed." }, { status: 500 });
  }
}
