"use client";

import { FormEvent, useEffect, useState } from "react";
import { createClient, Session } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
type Variant = { size_label: string; width_mm: string; length_mm: string; height_mm: string; price_rmb: string; config: string; note: string };

export default function SupplierProductSubmissionPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [sku, setSku] = useState(""); const [name, setName] = useState(""); const [displayName, setDisplayName] = useState("");
  const [categoryId, setCategoryId] = useState(""); const [description, setDescription] = useState(""); const [displayDescription, setDisplayDescription] = useState("");
  const [images, setImages] = useState<string[]>([]); const [uploading, setUploading] = useState(false); const [busy, setBusy] = useState(false); const [message, setMessage] = useState("");
  const [variant, setVariant] = useState<Variant>({ size_label: "", width_mm: "", length_mm: "", height_mm: "", price_rmb: "", config: "", note: "" });

  useEffect(() => { supabase.auth.getSession().then(({ data }) => setSession(data.session)); const { data: listener } = supabase.auth.onAuthStateChange((_event, current) => setSession(current)); return () => listener.subscription.unsubscribe(); }, []);

  async function upload(files: FileList | null) {
    if (!files?.length || !session) return;
    setUploading(true); setMessage("");
    try {
      const added: string[] = [];
      for (const file of Array.from(files)) {
        const form = new FormData(); form.append("file", file);
        const response = await fetch("/api/supplier/upload", { method: "POST", headers: { Authorization: `Bearer ${session.access_token}` }, body: form });
        const result = await response.json(); if (!response.ok) throw new Error(result.error || "Image upload failed"); added.push(result.url);
      }
      setImages(current => [...current, ...added]);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Upload failed"); }
    finally { setUploading(false); }
  }

  async function submit(event: FormEvent) {
    event.preventDefault(); if (!session) { setMessage("Please sign in first."); return; }
    setBusy(true); setMessage("");
    const payload = {
      sku_code: sku.trim(), name: name.trim(), display_name_en: displayName.trim() || name.trim(), category_id: categoryId.trim() || null,
      description: description.trim(), display_description_en: displayDescription.trim(),
      variants: [{ size_label: variant.size_label.trim(), width_mm: variant.width_mm ? Number(variant.width_mm) : null, length_mm: variant.length_mm ? Number(variant.length_mm) : null, height_mm: variant.height_mm ? Number(variant.height_mm) : null, price_rmb: variant.price_rmb ? Number(variant.price_rmb) : null, config: variant.config.trim(), note: variant.note.trim() }],
    };
    try {
      const response = await fetch("/api/supplier/submissions", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` }, body: JSON.stringify({ payload, image_urls: images }) });
      const result = await response.json(); if (!response.ok) throw new Error(result.error || "Submission failed");
      setMessage(`Submitted for review. Reference: ${result.submission.id}`); setSku(""); setName(""); setDisplayName(""); setCategoryId(""); setDescription(""); setDisplayDescription(""); setImages([]);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Submission failed"); }
    finally { setBusy(false); }
  }

  if (!session) return <main className="mx-auto max-w-2xl p-6"><h1 className="text-2xl font-semibold">Supplier product submission</h1><p className="mt-3">Please <a className="underline" href="/supplier/login">sign in</a> to submit products.</p></main>;
  return <main className="mx-auto max-w-3xl p-6 sm:p-10">
    <div className="flex items-center justify-between gap-4"><h1 className="text-2xl font-semibold">Submit a product</h1><button className="text-sm underline" onClick={async()=>{await supabase.auth.signOut();window.location.href="/supplier/login";}}>Sign out</button></div>
    <p className="mt-2 text-sm text-gray-600">Products are submitted for review and are not published automatically. Required: SKU and product name.</p>
    <form onSubmit={submit} className="mt-6 space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">SKU code *<input required maxLength={120} className="mt-1 w-full rounded border p-3" value={sku} onChange={e=>setSku(e.target.value)} /></label>
        <label className="block text-sm">Product name *<input required maxLength={300} className="mt-1 w-full rounded border p-3" value={name} onChange={e=>setName(e.target.value)} /></label>
        <label className="block text-sm">English display name<input className="mt-1 w-full rounded border p-3" value={displayName} onChange={e=>setDisplayName(e.target.value)} /></label>
        <label className="block text-sm">Category UUID (optional)<input className="mt-1 w-full rounded border p-3" value={categoryId} onChange={e=>setCategoryId(e.target.value)} placeholder="Existing categories.id" /></label>
      </div>
      <label className="block text-sm">Product description<textarea className="mt-1 w-full rounded border p-3" rows={3} value={description} onChange={e=>setDescription(e.target.value)} /></label>
      <label className="block text-sm">English display description<textarea className="mt-1 w-full rounded border p-3" rows={3} value={displayDescription} onChange={e=>setDisplayDescription(e.target.value)} /></label>
      <section className="rounded border p-4"><h2 className="font-medium">Variant / dimensions</h2><div className="mt-3 grid gap-3 sm:grid-cols-3">
        <label className="text-sm">Size label<input className="mt-1 w-full rounded border p-2" value={variant.size_label} onChange={e=>setVariant({...variant,size_label:e.target.value})}/></label>
        <label className="text-sm">Width (mm)<input type="number" min="0" className="mt-1 w-full rounded border p-2" value={variant.width_mm} onChange={e=>setVariant({...variant,width_mm:e.target.value})}/></label>
        <label className="text-sm">Length (mm)<input type="number" min="0" className="mt-1 w-full rounded border p-2" value={variant.length_mm} onChange={e=>setVariant({...variant,length_mm:e.target.value})}/></label>
        <label className="text-sm">Height (mm)<input type="number" min="0" className="mt-1 w-full rounded border p-2" value={variant.height_mm} onChange={e=>setVariant({...variant,height_mm:e.target.value})}/></label>
        <label className="text-sm">Price (RMB)<input type="number" min="0" step="0.01" className="mt-1 w-full rounded border p-2" value={variant.price_rmb} onChange={e=>setVariant({...variant,price_rmb:e.target.value})}/></label>
        <label className="text-sm">Configuration<input className="mt-1 w-full rounded border p-2" value={variant.config} onChange={e=>setVariant({...variant,config:e.target.value})}/></label>
      </div><label className="mt-3 block text-sm">Variant notes<textarea className="mt-1 w-full rounded border p-2" value={variant.note} onChange={e=>setVariant({...variant,note:e.target.value})}/></label></section>
      <section><label className="block text-sm font-medium">Product images (max 12 MB each)<input className="mt-2 block w-full text-sm" type="file" accept="image/*" multiple disabled={uploading} onChange={e=>void upload(e.target.files)}/></label><p className="mt-1 text-xs text-gray-500">{uploading ? "Uploading…" : `${images.length} image(s) uploaded`}</p><div className="mt-2 flex flex-wrap gap-2">{images.map(url=><div key={url} className="rounded border p-2 text-xs"><a className="underline" href={url} target="_blank" rel="noreferrer">View image</a><button type="button" className="ml-2 text-red-700" onClick={()=>setImages(old=>old.filter(item=>item!==url))}>Remove</button></div>)}</div></section>
      <button disabled={busy||uploading} className="rounded bg-black px-5 py-3 text-white disabled:opacity-50">{busy ? "Submitting…" : "Submit for review"}</button>
    </form>
    {message && <p role="status" className="mt-4 break-words rounded bg-gray-100 p-3 text-sm">{message}</p>}
  </main>;
}
