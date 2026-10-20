import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const authorization = request.headers.get("authorization");
    if (!authorization?.startsWith("Bearer ")) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return NextResponse.json({ error: "Supabase environment variables are missing." }, { status: 500 });
    const client = createClient(url, key, { global: { headers: { Authorization: authorization } } });
    const { data: { user }, error: authError } = await client.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: "Invalid session." }, { status: 401 });
    const { data: supplier, error: supplierError } = await client.from("suppliers").select("id").eq("auth_user_id", user.id).maybeSingle();
    if (supplierError) throw supplierError;
    if (!supplier) return NextResponse.json({ error: "This account is not linked to a supplier." }, { status: 403 });

    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return NextResponse.json({ error: "Image file is required." }, { status: 400 });
    if (!file.type.startsWith("image/")) return NextResponse.json({ error: "Only image files are allowed." }, { status: 415 });
    if (file.size > 12 * 1024 * 1024) return NextResponse.json({ error: "Image must be 12 MB or smaller." }, { status: 413 });
    const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    const path = `supplier-submissions/${supplier.id}/${crypto.randomUUID()}.${ext}`;
    const { error: uploadError } = await client.storage.from("home-products").upload(path, file, { contentType: file.type, upsert: false });
    if (uploadError) throw uploadError;
    const { data } = client.storage.from("home-products").getPublicUrl(path);
    return NextResponse.json({ path, url: data.publicUrl }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Upload failed." }, { status: 500 });
  }
}
