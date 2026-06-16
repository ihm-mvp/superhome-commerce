"use client"

import {
  useEffect,
  useState,
} from "react"

export default function SunshineRecoveryBuilderPage() {

  const [
    packages,
    setPackages,
  ] = useState<any[]>([])

  const [
    openings,
    setOpenings,
  ] = useState<any[]>([])

  const [
    products,
    setProducts,
  ] = useState<any[]>([])

  const [
    variants,
    setVariants,
  ] = useState<any[]>([])

  const [
    records,
    setRecords,
  ] = useState<any[]>([])

  const [
    selectedPackage,
    setSelectedPackage,
  ] = useState("")

  const [
    selectedOpening,
    setSelectedOpening,
  ] = useState("")

  const [
    selectedItemType,
    setSelectedItemType,
  ] = useState("")

  const [
    selectedProduct,
    setSelectedProduct,
  ] = useState("")

  const [
    selectedVariant,
    setSelectedVariant,
  ] = useState("")

  const [
    quantity,
    setQuantity,
  ] = useState(1)

  // ===== packages =====

  useEffect(() => {

    async function loadPackages() {

      const res =
        await fetch(
          "/api/admin/sunshine-recovery-packages"
        )

      const data =
        await res.json()

      setPackages(
        data || []
      )

    }

    loadPackages()

  }, [])

  // ===== openings =====

  useEffect(() => {

    if (
      !selectedPackage
    ) return

    async function loadOpenings() {

      const res =
        await fetch(
          `/api/admin/sunshine-recovery-openings?package_id=${selectedPackage}`
        )

      const data =
        await res.json()

      setOpenings(
        data || []
      )

    }

    loadOpenings()

  }, [selectedPackage])

  // ===== records =====

  useEffect(() => {

    if (
      !selectedPackage
    ) return

    async function loadRecords() {

      const res =
        await fetch(
          `/api/admin/sunshine-recovery-records?package_id=${selectedPackage}`
        )

      const data =
        await res.json()

      setRecords(
        data || []
      )

    }

    loadRecords()

  }, [selectedPackage])

  // ===== products =====

  useEffect(() => {

    if (
      !selectedItemType
    ) return

    async function loadProducts() {

      const res =
        await fetch(
          `/api/admin/sunshine-products?item_type=${selectedItemType}`
        )

      const data =
        await res.json()

      setProducts(
        data || []
      )

    }

    loadProducts()

  }, [selectedItemType])

  // ===== variants =====

  useEffect(() => {

    if (
      !selectedProduct
    ) return

    async function loadVariants() {

      const res =
        await fetch(
          `/api/admin/sunshine-variants?product_id=${selectedProduct}`
        )

      const data =
        await res.json()

      setVariants(
        data || []
      )

    }

    loadVariants()

  }, [selectedProduct])

  async function saveRecord() {

    if (
      !selectedPackage ||
      !selectedOpening ||
      !selectedProduct
    ) {

      alert(
        "Please complete all fields."
      )

      return

    }

    const res =
      await fetch(
        "/api/admin/sunshine-recovery-save",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            package_id:
              selectedPackage,

            opening_id:
              selectedOpening,

            product_id:
              selectedProduct,

            variant_id:
              selectedVariant || null,

            quantity,
          }),
        }
      )

    const result =
      await res.json()

    if (
      result.error
    ) {

      alert(
        result.error
      )

      return

    }

    alert(
      "Saved."
    )

    const refresh =
      await fetch(
        `/api/admin/sunshine-recovery-records?package_id=${selectedPackage}`
      )

    const refreshData =
      await refresh.json()

    setRecords(
      refreshData || []
    )

  }

  return (

    <div className="max-w-7xl mx-auto px-6 py-10">

      <div className="space-y-2 mb-8">

        <h1 className="text-3xl font-semibold">
          Sunshine Recovery Builder
        </h1>

        <div className="text-gray-500">
          Recover package opening
          products into
          package_opening_products.
        </div>

      </div>

      <div className="grid grid-cols-12 gap-8">

        {/* ===== LEFT ===== */}

        <div className="col-span-4">

          <div className="border rounded-2xl p-5 space-y-5">

            <div className="font-medium">
              Package
            </div>

            <select
              value={
                selectedPackage
              }
              onChange={(e) =>
                setSelectedPackage(
                  e.target.value
                )
              }
              className="w-full border rounded-lg px-3 py-2"
            >

              <option value="">
                Select Package
              </option>

              {packages.map(
                (p) => (
                  <option
                    key={p.id}
                    value={p.id}
                  >
                    {p.layouts?.name}
                    {" · "}
                    {p.name}
                  </option>
                )
              )}

            </select>

            <div className="font-medium">
              Opening
            </div>

            <select
              value={
                selectedOpening
              }
              onChange={(e) =>
                setSelectedOpening(
                  e.target.value
                )
              }
              className="w-full border rounded-lg px-3 py-2"
            >

              <option value="">
                Select Opening
              </option>

              {openings.map(
                (o) => (
                  <option
                    key={o.id}
                    value={o.id}
                  >
                    {o.room_name}
                    {" · "}
                    {o.opening_code}
                  </option>
                )
              )}

            </select>
            <div className="font-medium">
              Item Type
            </div>

            <select
              value={
                selectedItemType
              }
              onChange={(e) => {

                setSelectedItemType(
                  e.target.value
                )

                setSelectedProduct("")
                setSelectedVariant("")
                setProducts([])
                setVariants([])

              }}
              className="w-full border rounded-lg px-3 py-2"
            >

              <option value="">
                Select Item Type
              </option>

              <option value="curtain">
                Curtain
              </option>

              <option value="track">
                Track
              </option>

              <option value="blind">
                Blind
              </option>

            </select>

            <div className="font-medium">
              Product
            </div>

            <select
              value={
                selectedProduct
              }
              onChange={(e) =>
                setSelectedProduct(
                  e.target.value
                )
              }
              className="w-full border rounded-lg px-3 py-2"
            >

              <option value="">
                Select Product
              </option>

              {products.map(
                (p) => (
                  <option
                    key={p.id}
                    value={p.id}
                  >
                    {p.sku_code}
                    {" · "}
                    {p.name}
                  </option>
                )
              )}

            </select>

            <div className="font-medium">
              Variant
            </div>

            <select
              value={
                selectedVariant
              }
              onChange={(e) =>
                setSelectedVariant(
                  e.target.value
                )
              }
              className="w-full border rounded-lg px-3 py-2"
            >

              <option value="">
                Select Variant
              </option>

              {variants.map(
                (v) => (
                  <option
                    key={v.id}
                    value={v.id}
                  >
                    {[
                      v.size_label,
                      v.config,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </option>
                )
              )}

            </select>

            <div className="font-medium">
              Quantity
            </div>

            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) =>
                setQuantity(
                  Number(
                    e.target.value
                  )
                )
              }
              className="w-full border rounded-lg px-3 py-2"
            />

            <button
              onClick={
                saveRecord
              }
              className="
                w-full
                py-3
                bg-black
                text-white
                rounded-xl
              "
            >
              Save
            </button>

          </div>

        </div>

        {/* ===== RIGHT ===== */}

        <div className="col-span-8">

          <div className="border rounded-2xl p-6">

            <div className="text-lg font-semibold mb-6">
              Existing Records
            </div>

            <div className="space-y-3">

              {records.map(
                (
                  r: any,
                  idx: number
                ) => (

                  <div
                    key={idx}
                    className="
                      border
                      rounded-xl
                      p-4
                      flex
                      justify-between
                      items-center
                    "
                  >

                    <div>

                      <div className="font-medium">

                        {
                          r.opening
                            ?.room_name
                        }
                        {" · "}
                        {
                          r.opening
                            ?.opening_code
                        }

                      </div>

                      <div className="text-sm text-gray-500">

                        {
                          r.product
                            ?.sku_code
                        }

                        {" · "}

                        {
                          r.product
                            ?.name
                        }

                      </div>

                      {(
                        r.variant
                          ?.config ||
                        r.variant
                          ?.size_label
                      ) && (

                        <div className="text-xs text-gray-400">

                          {[
                            r.variant
                              ?.size_label,
                            r.variant
                              ?.config,
                          ]
                            .filter(
                              Boolean
                            )
                            .join(
                              " · "
                            )}

                        </div>

                      )}

                    </div>

                    <div className="text-sm text-gray-500">

                      Qty:
                      {" "}
                      {r.quantity}

                    </div>

                  </div>

                )
              )}

              {records.length ===
                0 && (

                <div className="text-gray-400">

                  No records found.

                </div>

              )}

            </div>

          </div>

        </div>

      </div>

    </div>

  )

}