"use client"

import {
  useEffect,
  useState,
} from "react"

export default function ProductBuilderPage() {

  const [
    packages,
    setPackages,
  ] = useState<any[]>([])

  const [
    rooms,
    setRooms,
  ] = useState<any[]>([])

  const [
    itemTypes,
    setItemTypes,
  ] = useState<any[]>([])

  const [
    products,
    setProducts,
  ] = useState<any[]>([])

  const [
    openings,
    setOpenings,
  ] = useState<any[]>([])

  const [
    packageId,
    setPackageId,
  ] = useState("")

  const [
    layoutId,
    setLayoutId,
  ] = useState("")

  const [
    roomId,
    setRoomId,
  ] = useState("")

  const [
    roomName,
    setRoomName,
  ] = useState("")

  const [
    itemTypeId,
    setItemTypeId,
  ] = useState("")

  const [
    openingRequired,
    setOpeningRequired,
  ] = useState(false)

  const [
    openingId,
    setOpeningId,
  ] = useState("")

  const [
    productId,
    setProductId,
  ] = useState("")

  const [
    variantId,
    setVariantId,
  ] = useState("")

  const [
    qty,
    setQty,
  ] = useState(1)

  useEffect(() => {

    loadPackages()

    loadItemTypes()

  }, [])

  async function loadPackages() {

    const res =
      await fetch(
        "/api/admin/product-builder-packages"
      )

    const json =
      await res.json()

    setPackages(
      json || []
    )

  }

  async function loadItemTypes() {

    const res =
      await fetch(
        "/api/admin/product-builder-item-types"
      )

    const json =
      await res.json()

    setItemTypes(
      json || []
    )

  }

  async function loadRooms(
    package_id: string
  ) {

    setPackageId(
      package_id
    )

    const pkg =
      packages.find(
        (p: any) =>
          p.id === package_id
      )

    setLayoutId(
      pkg?.layout_id || ""
    )

    const res =
      await fetch(
        `/api/admin/product-builder-rooms?package_id=${package_id}`
      )

    const json =
      await res.json()

    setRooms(
      json || []
    )

    setRoomId("")
    setRoomName("")
    setOpenings([])
    setOpeningId("")
    setProducts([])
    setProductId("")
    setVariantId("")

  }

  async function loadOpenings(
    layout_id: string,
    room_name: string
  ) {

    const res =
      await fetch(
        `/api/admin/sunshine-openings?layout_id=${layout_id}&room_name=${encodeURIComponent(room_name)}`
      )

    const json =
      await res.json()

    setOpenings(
      json || []
    )

  }

  async function handleRoomChange(
    value: string
  ) {

    setRoomId(
      value
    )

    const room =
      rooms.find(
        (r: any) =>
          r.id === value
      )

    setRoomName(
      room?.name || ""
    )

    setOpeningId("")

    if (
      openingRequired
    ) {

      await loadOpenings(
        layoutId,
        room?.name || ""
      )

    }

  }

  async function handleItemTypeChange(
    value: string
  ) {

    setItemTypeId(
      value
    )

    setProductId("")
    setVariantId("")
    setProducts([])

    const item =
      itemTypes.find(
        (i: any) =>
          i.id === value
      )

    setOpeningRequired(
      item?.is_opening_product
    )

    if (
      item?.is_opening_product &&
      roomName
    ) {

      await loadOpenings(
        layoutId,
        roomName
      )

    } else {

      setOpenings([])
      setOpeningId("")

    }

    const res =
      await fetch(
        `/api/admin/product-builder-products?category_id=${item.category_id}`
      )

    const json =
      await res.json()

    setProducts(
      json || []
    )

  }
    function selectedProduct() {

    return products.find(
      (p: any) =>
        p.id === productId
    )

  }

  async function add() {

    if (
      !packageId ||
      !roomId ||
      !itemTypeId ||
      !productId ||
      !variantId
    ) {

      alert(
        "Please complete all selections."
      )

      return

    }

    if (
      openingRequired &&
      !openingId
    ) {

      alert(
        "Please select opening."
      )

      return

    }

    const res =
      await fetch(
        "/api/admin/product-builder-add",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({

              package_id:
                packageId,

              room_id:
                roomId,

              item_type_id:
                itemTypeId,

              opening_id:
                openingId ||

                null,

              product_id:
                productId,

              variant_id:
                variantId,

              quantity:
                qty,

            }),
        }
      )

    const json =
      await res.json()

    if (
      !res.ok
    ) {

      alert(
        json.error
      )

      return

    }

    alert(
      "Added"
    )

  }

  return (

    <div className="max-w-4xl mx-auto p-8 space-y-6">

      <h1 className="text-2xl font-semibold">
        Product Builder
      </h1>

      <select
        value={packageId}
        onChange={(e) =>
          loadRooms(
            e.target.value
          )
        }
        className="border p-2 w-full"
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
              {p.layouts?.name}
              {" | "}
              {p.name}
            </option>

          )
        )}

      </select>

      <select
        value={roomId}
        onChange={(e) =>
          handleRoomChange(
            e.target.value
          )
        }
        className="border p-2 w-full"
      >

        <option value="">
          Select Room
        </option>

        {rooms.map(
          (r: any) => (

            <option
              key={r.id}
              value={r.id}
            >
              {r.name}
            </option>

          )
        )}

      </select>

      <select
        value={itemTypeId}
        onChange={(e) =>
          handleItemTypeChange(
            e.target.value
          )
        }
        className="border p-2 w-full"
      >

        <option value="">
          Select Item Type
        </option>

        {itemTypes.map(
          (i: any) => (

            <option
              key={i.id}
              value={i.id}
            >
              {i.name}
            </option>

          )
        )}

      </select>

      {openingRequired && (

        <select
          value={openingId}
          onChange={(e) =>
            setOpeningId(
              e.target.value
            )
          }
          className="border p-2 w-full"
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
                {" × "}
                {o.height_mm}
              </option>

            )
          )}

        </select>

      )}

      <select
        value={productId}
        onChange={(e) => {

          setProductId(
            e.target.value
          )

          setVariantId("")

        }}
        className="border p-2 w-full"
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
        value={variantId}
        onChange={(e) =>
          setVariantId(
            e.target.value
          )
        }
        className="border p-2 w-full"
      >

        <option value="">
          Select Variant
        </option>

        {selectedProduct()
          ?.variants?.map(
            (v: any) => (

              <option
                key={v.id}
                value={v.id}
              >
                {v.size_label}
                {" | "}
                {v.config}
                {" | ¥"}
                {v.price_rmb}
              </option>

            )
          )}

      </select>

      <select
        value={qty}
        onChange={(e) =>
          setQty(
            Number(
              e.target.value
            )
          )
        }
        className="border p-2 w-full"
      >

        {[1,2,3,4,5,6].map(
          (n) => (

            <option
              key={n}
              value={n}
            >
              {n}
            </option>

          )
        )}

      </select>

      <button
        onClick={add}
        className="
          bg-black
          text-white
          px-4
          py-2
          rounded-lg
        "
      >
        Add Product
      </button>

    </div>

  )

}