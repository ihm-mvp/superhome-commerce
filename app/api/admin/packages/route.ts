// /app/api/admin/packages/route.ts
import { supabase } from "@/lib/supabase"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const layout_id = searchParams.get("layout_id")

  const { data } = await supabase
    .from("packages")
    .select("id, name")
    .eq("layout_id", layout_id)

  return Response.json(data)
}