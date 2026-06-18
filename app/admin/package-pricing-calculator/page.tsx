// /app/admin/package-pricing-calculator/page.tsx

"use client"

import { useEffect, useMemo, useState } from "react"

import {
  calculateProductExwCost
} from "@/lib/product-cost"

type ProductRow = {
  room_name: string

  opening_code?: string

  sku_code: string

  quantity: number

  exw_price_rmb: number

  width_mm?: number | null

  height_mm?: number | null

  variant_config?: string
}

export default function PackagePricingCalculatorPage() {

  const [packages, setPackages] = useState<any[]>([])
  const [selectedPackageId, setSelectedPackageId] = useState("")
  const [rows, setRows] = useState<ProductRow[]>([])

  // ===== 输入参数 =====
  const [fxRate, setFxRate] = useState(4.0)
  const [shippingFactor, setShippingFactor] = useState(1.2)
  const [localCost, setLocalCost] = useState(2000)
  const [marginPercent, setMarginPercent] = useState(10)
  const [
  displayPrice,
  setDisplayPrice,
] = useState(0)

  // ===== 中国出口成本系数 =====
const [
  exportFactor,
  setExportFactor,
] = useState(1.1)

  // ===== GST =====
  const gstRate = 15

  // ===== package list =====
  useEffect(() => {

    async function loadPackages() {

      const res = await fetch(
        "/api/admin/package-pricing/packages"
      )

      const data = await res.json()

      setPackages(data || [])
    }

    loadPackages()

  }, [])

  // ===== package detail =====
  useEffect(() => {

    if (!selectedPackageId) return

    async function loadPackageRows() {

      const res = await fetch(
        `/api/admin/package-pricing/package-details?package_id=${selectedPackageId}`
      )

      const data = await res.json()

      setRows(data || [])
    }

    loadPackageRows()

  }, [selectedPackageId])

  // ===== grouped by room =====
  const grouped = useMemo(() => {

    const map: Record<string, ProductRow[]> = {}

    rows.forEach((r) => {

      if (!map[r.room_name]) {
        map[r.room_name] = []
      }

      map[r.room_name].push(r)
    })

    return map

  }, [rows])

  // ===== EXW RMB =====
const exwTotalRmb = useMemo(() => {

  return rows.reduce(
    (sum, r) => {

      return (
        sum +
        calculateProductExwCost(r)
      )

    },
    0
  )

}, [rows])

  // ===== 中国出口成本 =====
  const exportCostRmb =
    exwTotalRmb * (exportFactor - 1)

  const totalChinaCostRmb =
    exwTotalRmb + exportCostRmb

  // ===== NZD =====
  const exwTotalNzd =
    exwTotalRmb / fxRate

  const exportCostNzd =
    exportCostRmb / fxRate

  const totalChinaCostNzd =
    totalChinaCostRmb / fxRate

  // ===== landed =====
  const landedCost =
    totalChinaCostNzd * shippingFactor

  // ===== subtotal =====
  const subtotalBeforeMargin =
    landedCost + localCost

  // ===== margin =====
  const beforeGstPrice =
    subtotalBeforeMargin /
    (1 - marginPercent / 100)

  // ===== GST =====
  const gstAmount =
    beforeGstPrice * (gstRate / 100)

  // ===== final =====
  const finalPrice =
    beforeGstPrice + gstAmount

  const roundedPrice =
    Math.round(finalPrice / 100) * 100

    useEffect(() => {

  setDisplayPrice(
    roundedPrice
  )

}, [roundedPrice])

  // ===== save =====
  async function saveDisplayPrice() {

    if (!selectedPackageId) return

    await fetch(
      "/api/admin/package-pricing/save-display-price",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          package_id: selectedPackageId,
          display_price: displayPrice,
        }),
      }
    )

    alert("Display price saved.")
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      <div className="space-y-2 mb-8">

        <h1 className="text-3xl font-semibold">
          Package Pricing Calculator
        </h1>

        <div className="text-gray-500">
          Calculate package pricing based on EXW cost,
          China export cost, logistics, local cost,
          margin and GST.
        </div>

      </div>

      <div className="grid grid-cols-12 gap-8">

        {/* ===== LEFT ===== */}
        <div className="col-span-3 space-y-6">

          <div className="border rounded-2xl p-5 space-y-4">

            <div className="font-medium">
              Package
            </div>

            <select
              value={selectedPackageId}
              onChange={(e) =>
                setSelectedPackageId(
                  e.target.value
                )
              }
              className="w-full border rounded-lg px-3 py-2"
            >

              <option value="">
                Select Package
              </option>

              {packages.map((p) => (
                <option
                  key={p.id}
                  value={p.id}
                >
                  {p.layout_name} · {p.name}
                </option>
              ))}

            </select>

          </div>

          <div className="border rounded-2xl p-5 space-y-5">

            <div className="font-medium">
              Pricing Inputs
            </div>

            <div className="space-y-2">

              <div className="text-sm text-gray-500">
                RMB / NZD FX Rate
              </div>

              <input
                type="number"
                value={fxRate}
                step="0.01"
                onChange={(e) =>
                  setFxRate(
                    Number(e.target.value)
                  )
                }
                className="w-full border rounded-lg px-3 py-2"
              />

            </div>

            <div className="space-y-2">

              <div className="text-sm text-gray-500">
                China Export Factor
              </div>

<input
  type="number"
  value={exportFactor}
  step="0.01"
  onChange={(e) =>
    setExportFactor(
      Number(e.target.value)
    )
  }
  className="w-full border rounded-lg px-3 py-2"
/>

            </div>

            <div className="space-y-2">

              <div className="text-sm text-gray-500">
                Shipping Factor
              </div>

              <input
                type="number"
                value={shippingFactor}
                step="0.01"
                onChange={(e) =>
                  setShippingFactor(
                    Number(e.target.value)
                  )
                }
                className="w-full border rounded-lg px-3 py-2"
              />

            </div>

            <div className="space-y-2">

              <div className="text-sm text-gray-500">
                NZ Local Cost
              </div>

              <input
                type="number"
                value={localCost}
                onChange={(e) =>
                  setLocalCost(
                    Number(e.target.value)
                  )
                }
                className="w-full border rounded-lg px-3 py-2"
              />

            </div>

            <div className="space-y-2">

              <div className="text-sm text-gray-500">
                Margin %
              </div>

              <input
                type="number"
                value={marginPercent}
                onChange={(e) =>
                  setMarginPercent(
                    Number(e.target.value)
                  )
                }
                className="w-full border rounded-lg px-3 py-2"
              />

            </div>

          </div>

        </div>

        {/* ===== MIDDLE ===== */}
        <div className="col-span-5">

          <div className="border rounded-2xl p-6 space-y-8">

            <div className="flex justify-between items-center">

              <div className="font-medium text-lg">
                EXW Product Breakdown
              </div>

              <div className="text-sm text-gray-500">
                RMB
              </div>

            </div>

            {Object.entries(grouped).map(
              ([roomName, products]) => (

                <div
                  key={roomName}
                  className="space-y-4"
                >

                  <div className="text-lg font-semibold border-b pb-2">
                    {roomName}
                  </div>

                  <div className="space-y-3">

                    {products.map((p, idx) => (

                      <div
                        key={idx}
                        className="flex justify-between text-sm"
                      >

                        <div className="flex-1">

                          <div>
                            {p.sku_code}

                            <span className="text-gray-400 ml-2">
                              ×{p.quantity}
                            </span>
                          </div>

{p.sku_code?.startsWith(
  "SUN-CUR-"
) && (

  <div className="text-xs text-blue-600">

    ({p.width_mm} + 300)
    ÷ 1000
    × 2.2
    × ¥{p.exw_price_rmb}

    = ¥
    {calculateProductExwCost(p)
      .toFixed(0)}

  </div>

)}

{p.sku_code?.startsWith(
  "SUN-TRK-"
) && (

  <div className="text-xs text-blue-600">

    ({p.width_mm} + 300)
    ÷ 1000
    × ¥{p.exw_price_rmb}

    = ¥
    {calculateProductExwCost(p)
      .toFixed(0)}

  </div>

)}

{p.sku_code?.startsWith(
  "SUN-BLD-"
) && (

  <div className="text-xs text-blue-600">

    {p.width_mm}
    ×
    {p.height_mm}
    ÷ 1000000
    × ¥{p.exw_price_rmb}

    = ¥
    {calculateProductExwCost(p)
      .toFixed(0)}

  </div>

)}

                        </div>

                        <div className="w-28 text-right">
¥
{calculateProductExwCost(p)
  .toLocaleString(
    undefined,
    {
      maximumFractionDigits: 0,
    }
  )}
                        </div>

                      </div>
                    ))}

                  </div>

                </div>
              )
            )}

            <div className="border-t pt-5 space-y-3">

              <div className="flex justify-between text-sm">
                <div>EXW Total</div>
                <div>
                  ¥{exwTotalRmb.toLocaleString()}
                </div>
              </div>

              <div className="flex justify-between text-sm">
                <div>China Export Cost</div>
                <div>
                  ¥{exportCostRmb.toLocaleString()}
                </div>
              </div>

              <div className="flex justify-between text-lg font-semibold border-t pt-3">
                <div>Total China Cost</div>
                <div>
                  ${totalChinaCostNzd.toFixed(0)}
                </div>
              </div>

              <div className="flex justify-between">
                <div>Landed Cost</div>
                <div>
                  ${landedCost.toFixed(0)}
                </div>
              </div>

              <div className="flex justify-between">
                <div>NZ Local Cost</div>
                <div>
                  ${localCost.toLocaleString()}
                </div>
              </div>

              <div className="flex justify-between">
                <div>Margin</div>
                <div>
                  {marginPercent}%
                </div>
              </div>

              <div className="flex justify-between">
                <div>GST</div>
                <div>
                  {gstRate}%
                </div>
              </div>

              <div className="flex justify-between">
                <div>GST Amount</div>
                <div>
                  ${gstAmount.toFixed(0)}
                </div>
              </div>

            </div>

            <div className="border-t pt-6 space-y-2">

              <div className="text-sm text-gray-500">
                Suggested Display Price (Included GST)
              </div>

<div className="space-y-4">

  <div>

    <div className="text-sm text-gray-500">
      Suggested Price
    </div>

    <div className="text-4xl font-semibold">
      ${roundedPrice.toLocaleString()}
    </div>

  </div>

  <div>

    <div className="text-sm text-gray-500">
      Display Price
    </div>

    <input
      type="number"
      value={displayPrice}
      onChange={(e) =>
        setDisplayPrice(
          Number(e.target.value)
        )
      }
      className="
        w-full
        border
        rounded-lg
        px-3
        py-2
      "
    />

  </div>

</div>

            </div>

            <button
              onClick={saveDisplayPrice}
              className="w-full py-3 bg-black text-white rounded-xl"
            >
              Save Display Price
            </button>

          </div>

        </div>

      </div>

    </div>
  )
}