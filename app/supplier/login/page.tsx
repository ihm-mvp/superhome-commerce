"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function SupplierLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) { setMessage(error.message); return; }
    window.location.href = "/supplier/products/new";
  }

  return <main className="mx-auto max-w-md p-6 sm:p-10">
    <h1 className="text-2xl font-semibold">Supplier sign in</h1>
    <p className="mt-2 text-sm text-gray-600">Supplier accounts must be created and linked to a supplier record by the project administrator.</p>
    <form onSubmit={submit} className="mt-6 space-y-4">
      <label className="block text-sm">Email<input className="mt-1 w-full rounded border p-3" type="email" required value={email} onChange={e=>setEmail(e.target.value)} autoComplete="username" /></label>
      <label className="block text-sm">Password<input className="mt-1 w-full rounded border p-3" type="password" required value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password" /></label>
      <button disabled={busy} className="w-full rounded bg-black px-4 py-3 text-white disabled:opacity-50">{busy ? "Signing in…" : "Sign in"}</button>
    </form>
    {message && <p role="alert" className="mt-4 text-sm text-red-700">{message}</p>}
  </main>;
}
