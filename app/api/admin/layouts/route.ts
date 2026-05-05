// /app/api/admin/layouts/route.ts
import { supabase } from "@/lib/supabase"

export async function GET() {
  const { data } = await supabase.from("layouts").select("id, name")
  return Response.json(data)
}