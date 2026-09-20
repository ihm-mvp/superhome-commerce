"use client"

import { useEffect, useState } from "react"

export default function SunshineBuilder() {

  const [
    packages,
    setPackages,
  ] = useState<any[]>([])

  const [
    rooms,
    setRooms,
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
    selectedPackage,
    setSelectedPackage,
  ] = useState<any>(null)

  const [
    selectedRoom,
    setSelectedRoom,
  ] = useState("")

  const [
    selectedOpening,
    setSelectedOpening,
  ] = useState("")

  const [
    itemType,
    setItemType,
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

  useEffect(() => {

    loadPackages()

  }, [])

  async function loadPackages() {

    const res =
      await fetch(
        "/api/admin/sunshine-packages"
      )

    const data =
      await res.json()

    setPackages(data)

  }

async function loadRooms(
  layoutId: string
) {

  const res =
    await fetch(
      `/api/admin/sunshine-openings?layout_id=${layoutId}`
    )

  const data =
    await res.json()

  const uniqueRooms = Array.from(
    new Set(
      data
        .map((o: any) => o.room_name)
        .filter(Boolean)
    )
  ).map(
    (roomName: any) => ({
      id: roomName,
      name: roomName,
    })
  )

  setRooms(uniqueRooms)
}

  async function loadOpenings(
    layoutId: string,
    roomName: string
  ) {

    const res =
      await fetch(
        `/api/admin/sunshine-openings?layout_id=${layoutId}&room_name=${encodeURIComponent(roomName)}`
      )

    const data =
      await res.json()

    setOpenings(data)

  }

  async function loadProducts(
    itemTypeName: string
  ) {

    const res =
      await fetch(
        `/api/admin/sunshine-products?item_type=${itemTypeName}`
      )

    const data =
      await res.json()

    setProducts(data)

  }

  async function loadVariants(
    productId: string
  ) {

    const res =
      await fetch(
        `/api/admin/sunshine-builder-variants?product_id=${productId}`
      )

    const data =
      await res.json()

    setVariants(data)

  }

  const handlePackageChange =
    async (
      packageId: string
    ) => {

      const pkg =
        packages.find(
          (p) =>
            p.id === packageId
        )

      setSelectedPackage(
        pkg
      )

      setSelectedRoom("")
      setSelectedOpening("")
      setItemType("")
      setSelectedProduct("")
      setSelectedVariant("")

      setRooms([])
      setOpenings([])
      setProducts([])
      setVariants([])

      await loadRooms(
        pkg.layout_id
      )

    }

  const handleRoomChange =
    async (
      roomName: string
    ) => {

      setSelectedRoom(
        roomName
      )

      setSelectedOpening("")
      setItemType("")
      setSelectedProduct("")
      setSelectedVariant("")

      setOpenings([])
      setProducts([])
      setVariants([])

      await loadOpenings(
        selectedPackage.layout_id,
        roomName
      )

    }

  const handleItemTypeChange =
    async (
      value: string
    ) => {

      setItemType(
        value
      )

      setSelectedProduct("")
      setSelectedVariant("")

      setProducts([])
      setVariants([])

      await loadProducts(
        value
      )

    }

  const handleProductChange =
    async (
      productId: string
    ) => {

      setSelectedProduct(
        productId
      )

      setSelectedVariant(
        ""
      )

      setVariants([])

      await loadVariants(
        productId
      )

    }

async function addProduct() {

  if (
    !selectedPackage ||
    !selectedOpening ||
    !itemType ||
    !selectedProduct ||
    !selectedVariant
  ) {

    alert(
      "Please complete all selections"
    )

    return

  }

  const res =
    await fetch(
      "/api/admin/sunshine-builder-add-product",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify({

            package_id:
              selectedPackage.id,

            opening_id:
              selectedOpening,

            product_id:
              selectedProduct,

            variant_id:
              selectedVariant,

            quantity,

          }),
      }
    )

  const result =
    await res.json()

  if (
    !res.ok
  ) {

    alert(
      result.error
    )

    return

  }

  alert(
    "Added"
  )

}

  return (

    <div
      className="
        max-w-4xl
        mx-auto
        p-8
        space-y-6
      "
    >

      <h1
        className="
          text-2xl
          font-semibold
        "
      >
        Sunshine Builder
      </h1>

      <select
        className="
          border
          p-2
          w-full
        "
        value={
          selectedPackage?.id ||
          ""
        }
        onChange={(
          e
        ) =>
          handlePackageChange(
            e.target.value
          )
        }
      >

        <option value="">
          Select Package
        </option>

        {packages.map(
          (p: any) => (

            <option
              key={p.id}
              value={p.id}
            >
              {
                p.layouts?.name
              }
              {" - "}
              {p.name}
            </option>

          )
        )}

      </select>

      <select
        className="
          border
          p-2
          w-full
        "
        value={
          selectedRoom
        }
        onChange={(
          e
        ) =>
          handleRoomChange(
            e.target.value
          )
        }
      >

        <option value="">
          Select Room
        </option>

        {rooms.map(
          (r: any) => (

            <option
              key={r.id}
              value={r.name}
            >
              {r.name}
            </option>

          )
        )}

      </select>

      <select
        className="
          border
          p-2
          w-full
        "
        value={
          selectedOpening
        }
        onChange={(
          e
        ) =>
          setSelectedOpening(
            e.target.value
          )
        }
      >

        <option value="">
          Select Opening
        </option>

        {openings.map(
          (o: any) => (

            <option
              key={o.id}
              value={o.id}
            >
              {o.opening_code}
              {" | "}
              {o.width_mm}
              {" x "}
              {o.height_mm}
            </option>

          )
        )}

      </select>

      <select
        className="
          border
          p-2
          w-full
        "
        value={itemType}
        onChange={(
          e
        ) =>
          handleItemTypeChange(
            e.target.value
          )
        }
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

      <select
        className="
          border
          p-2
          w-full
        "
        value={
          selectedProduct
        }
        onChange={(
          e
        ) =>
          handleProductChange(
            e.target.value
          )
        }
      >

        <option value="">
          Select Product
        </option>

        {products.map(
          (p: any) => (

            <option
              key={p.id}
              value={p.id}
            >
              {p.sku_code}
              {" | "}
              {p.name}
            </option>

          )
        )}

      </select>

      <select
        className="
          border
          p-2
          w-full
        "
        value={
          selectedVariant
        }
        onChange={(
          e
        ) =>
          setSelectedVariant(
            e.target.value
          )
        }
      >

        <option value="">
          Select Variant
        </option>

        {variants.map(
          (v: any) => (

            <option
              key={v.id}
              value={v.id}
            >
              {
                v.size_label
              }
              {" | "}
              {v.config}
            </option>

          )
        )}

      </select>

      <input
        type="number"
        min="1"
        value={quantity}
        onChange={(
          e
        ) =>
          setQuantity(
            Number(
              e.target.value
            )
          )
        }
        className="
          border
          p-2
          w-full
        "
      />

      <button
        onClick={
          addProduct
        }
        className="
          bg-black
          text-white
          px-4
          py-2
        "
      >
        Add Product
      </button>

    </div>

  )

}