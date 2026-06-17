// /app/api/admin/package-structure/route.ts
import { supabase } from "@/lib/supabase"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const package_id = searchParams.get("package_id")

  const { data } = await supabase
    .from("package_rooms")
    .select(`
      id,
      name,
      package_items (
        id,
        product_id,
        variant_id,
        products (name),
        variants (size_label)
      )
    `)
    .eq("package_id", package_id)

  const formatted = data?.map((room: any) => ({
    name: room.name,
    items: room.package_items.map((i: any) => ({
      id: i.id,
      product_name: i.products?.name,
      variant: i.variants?.size_label,
    })),
  }))

  return Response.json(formatted)
}