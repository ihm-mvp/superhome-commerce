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
        package_item_products (
          id,
          product_id,
          variant_id
        )
      )
    `)
    .eq("package_id", package_id)

  // 2️⃣ 所有 products
  const { data: products } = await supabase
    .from("products")
    .select("id, sku_code, category_id")

  // 3️⃣ 所有 variants
  const { data: variants } = await supabase
    .from("variants")
    .select("id, product_id, config")

  // 4️⃣ 建 product → variants map
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

  // 5️⃣ 输出结构（关键逻辑在这里）
  const formatted = (rooms || []).map((room: any) => ({
    name: room.name,
    items: (room.package_items || []).map((item: any) => ({
      id: item.id,
      pips: (item.package_item_products || []).map((pip: any) => {

        const currentProduct = productMap[pip.product_id]

        const options = currentProduct
          ? Object.values(productMap).filter(
              (p: any) => p.category_id === currentProduct.category_id
            )
          : Object.values(productMap)

        return {
          id: pip.id,
          product_id: pip.product_id,
          variant_id: pip.variant_id,
          options,                // 👈 每个 pip 自带 options
        }
      }),
    })),
  }))

  return Response.json(formatted)
}