// /lib/product-cost.ts

export type ProductCostRow = {
  sku_code: string

  quantity: number

  exw_price_rmb: number

  width_mm?: number | null

  height_mm?: number | null
}

export function calculateProductExwCost(
  row: ProductCostRow
): number {

  const sku =
    row.sku_code || ""

  // ====================
  // Curtain
  // ====================

  if (
    sku.startsWith(
      "SUN-CUR-"
    )
  ) {

    return (

      (
        (
          (
            row.width_mm || 0
          ) + 300
        )
        / 1000
      )

      *

      2.2

      *

      row.exw_price_rmb

    )

  }

  // ====================
  // Track
  // ====================

  if (
    sku.startsWith(
      "SUN-TRK-"
    )
  ) {

    return (

      (
        (
          row.width_mm || 0
        ) + 300
      )

      / 1000

      *

      row.exw_price_rmb

    )

  }

  // ====================
  // Blind
  // ====================

  if (
    sku.startsWith(
      "SUN-BLD-"
    )
  ) {

    return (

      (
        (
          row.width_mm || 0
        )
        / 1000
      )

      *

      (
        (
          row.height_mm || 0
        )
        / 1000
      )

      *

      row.exw_price_rmb

    )

  }

  // ====================
  // Furniture
  // ====================

  return (

    row.exw_price_rmb

    *

    row.quantity

  )

}