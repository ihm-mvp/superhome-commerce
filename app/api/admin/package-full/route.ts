import { supabase } from "@/lib/supabase"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const package_id = searchParams.get("package_id")

  // 1️⃣ 获取结构
  const { data } = await supabase
    .from("package_rooms")
    .select(`
      id,
      name,
      package_items (
        id,
        item_type_id,
        item_types (name, category_id),
        package_item_products (
          id,
          product_id,
          variant_id
        )
      )
    `)
    .eq("package_id", package_id)

  // 2️⃣ 获取所有 products + variants
  const { data: products } = await supabase
    .from("products")
    .select(`
      id,
      sku_code,
      category_id,
      variants (id, config)
    `)

  // 3️⃣ 拼装 options
  const formatted = data?.map((room: any) => ({
    name: room.name,
    items: room.package_items.map((i: any) => {
      const options = products
        ?.filter((p: any) => p.category_id === i.item_types?.category_id)
        .map((p: any) => ({
          id: p.id,
          sku_code: p.sku_code,
          variants: p.variants,
        }))

      return {
        id: i.id,
        item_type_name: i.item_types?.name,
        options,
        pips: i.package_item_products.map((p: any) => ({
          ...p,
        })),
      }
    }),
  }))

  return Response.json(formatted)
}