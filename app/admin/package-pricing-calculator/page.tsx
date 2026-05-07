// /app/admin/package-pricing-calculator/page.tsx

"use client"

import { useEffect, useMemo, useState } from "react"

type ProductRow = {
  room_name: string
  sku_code: string
  quantity: number
  exw_price_rmb: number
}

export default function PackagePricingCalculatorPage() {

  const [packages, setPackages] = useState<any[]>([])
  const [selectedPackageId, setSelectedPackageId] = useState("")
  const [rows, setRows] = useState<ProductRow[]>([])

  // ===== 输入参数 =====
  const [fxRate, setFxRate] = useState(4.5)
  const [shippingFactor, setShippingFactor] = useState(1.1)
  const [localCost, setLocalCost] = useState(3500)
  const [marginPercent, setMarginPercent] = useState(35)

  // ===== display price =====
  const [displayPrice, setDisplayPrice] = useState(0)

  // ===== package list =====
  useEffect(() => {

    async function loadPackages() {

      const res = await fetch("/api/admin/package-pricing/packages")

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

  // ===== totals =====
  const exwTotalRmb = useMemo(() => {

    return rows.reduce((sum, r) => {
      return sum + (r.exw_price_rmb || 0) * r.quantity
    }, 0)

  }, [rows])

  const exwTotalNzd = exwTotalRmb / fxRate

  const landedCost =
    exwTotalNzd * shippingFactor

  const subtotal =
    landedCost + localCost

  const suggestedPrice =
    subtotal / (1 - marginPercent / 100)

  const roundedPrice =
    Math.round(suggestedPrice / 100) * 100

  // ===== save =====
  async function saveDisplayPrice() {

    if (!selectedPackageId) return

    await fetch("/api/admin/package-pricing/save-display-price", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        package_id: selectedPackageId,
        display_price: roundedPrice,
      }),
    })

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
          logistics, local cost and margin.
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
                setSelectedPackageId(e.target.value)
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
                  setFxRate(Number(e.target.value))
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
                  setShippingFactor(Number(e.target.value))
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
                  setLocalCost(Number(e.target.value))
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
                  setMarginPercent(Number(e.target.value))
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

                          {p.sku_code}

                          <span className="text-gray-400 ml-2">
                            ×{p.quantity}
                          </span>

                        </div>

                        <div className="w-28 text-right">
                          ¥
                          {(
                            p.exw_price_rmb *
                            p.quantity
                          ).toLocaleString()}
                        </div>

                      </div>
                    ))}

                  </div>

                </div>
              )
            )}

            <div className="border-t pt-5 flex justify-between text-lg font-semibold">

              <div>
                EXW Total
              </div>

              <div>
                ¥{exwTotalRmb.toLocaleString()}
              </div>

            </div>

          </div>

        </div>

        {/* ===== RIGHT ===== */}
        <div className="col-span-4">

          <div className="border rounded-2xl p-6 space-y-6">

            <div className="font-medium text-lg">
              Pricing Summary
            </div>

            <div className="space-y-4 text-sm">

              <div className="flex justify-between">
                <div>EXW Total (NZD)</div>
                <div>
                  ${exwTotalNzd.toFixed(0)}
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

            </div>

            <div className="border-t pt-6 space-y-2">

              <div className="text-sm text-gray-500">
                Suggested Display Price
              </div>

              <div className="text-4xl font-semibold">
                ${roundedPrice.toLocaleString()}
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