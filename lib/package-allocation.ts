// /lib/package-allocation.ts

import {
  calculateProductExwCost,
} from "@/lib/product-cost"

export type AllocationRow = {
  
  allocation_id?: string
  
    sku_code: string

  quantity: number

  exw_price_rmb: number

  width_mm?: number | null

  height_mm?: number | null
}

export function calculatePackageAllocation(
  rows: AllocationRow[],

  displayPrice: number
) {

  // ====================
  // Product Cost
  // ====================

  const products = rows.map(
    (row) => ({

      ...row,

      product_cost:

        calculateProductExwCost(
          row
        ),

    })
  )

  // ====================
  // Package Cost Total
  // ====================

  const packageCostTotal =
    products.reduce(

      (sum, p) =>

        sum +
        p.product_cost,

      0

    )

  // ====================
  // Protection
  // ====================

  if (
    packageCostTotal <= 0
  ) {

    return {

      package_cost_total: 0,

      rows:

        products.map(
          (p) => ({

            ...p,

            percentage: 0,

            included_value: 0,

          })
        ),

    }

  }

  // ====================
  // Allocation
  // ====================

  const allocatedRows =

    products.map(
      (p) => {

        const percentage =

          p.product_cost
          /
          packageCostTotal

        const includedValue =

          Math.round(
            displayPrice
            *
            percentage
          )

        return {

          ...p,

          percentage,

          included_value:
            includedValue,

        }

      }
    )

  return {

    package_cost_total:
      packageCostTotal,

    rows:
      allocatedRows,

  }

}