import { supabase } from "@/lib/supabase"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const package_id = searchParams.get("package_id")

  // 1️⃣ 结构
  const { data: rooms } = await supabase
    .from("package_rooms")
    .select(`
      id,
      name,
      package_items (
        id,
        item_type_id,
        item_types (id, name, category_id),
        package_item_products (
          id,
          product_id,
          variant_id
        )
      )
    `)
    .eq("package_id", package_id)

  // 2️⃣ products（不带 variants）
  const { data: products } = await supabase
    .from("products")
    .select("id, sku_code, category_id")

  // 3️⃣ variants 单独查
  const { data: variants } = await supabase
    .from("variants")
    .select("id, product_id, config")

  // 4️⃣ 手动拼 variants
  const productMap: any = {}

  for (const p of products || []) {
    productMap[p.id] = {
      id: p.id,
      sku_code: p.sku_code,
      category_id: p.category_id,
      variants: [],
    }
  }

  for (const v of variants || []) {
    if (productMap[v.product_id]) {
      productMap[v.product_id].variants.push({
        id: v.id,
        config: v.config,
      })
    }
  }

  const productList = Object.values(productMap)

  // 5️⃣ 构建返回
  const formatted = rooms?.map((room: any) => ({
    name: room.name,
    items: room.package_items.map((i: any) => {
      const options = productList.filter(
        (p: any) => p.category_id === i.item_types?.category_id
      )

      return {
        id: i.id,
        item_type_name: i.item_types?.name,
        options,
        pips: i.package_item_products,
      }
    }),
  }))

  return Response.json(formatted)
}