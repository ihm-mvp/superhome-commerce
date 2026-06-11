"use client"

import {
  useEffect,
  useState,
} from "react"

export default function PackageRecovery() {

  const [packages, setPackages] =
    useState<any[]>([])

  const [packageId, setPackageId] =
    useState("")

  const [rooms, setRooms] =
    useState<any[]>([])

  const [itemTypes, setItemTypes] =
    useState<any[]>([])

  const [products, setProducts] =
    useState<any[]>([])

  const [variants, setVariants] =
    useState<any[]>([])

  const [roomId, setRoomId] =
    useState("")

  const [itemTypeId, setItemTypeId] =
    useState("")

  const [productId, setProductId] =
    useState("")

  const [variantId, setVariantId] =
    useState("")

  const [qty, setQty] =
    useState(1)

  useEffect(() => {

    fetch(
      "/api/admin/recovery-packages"
    )
      .then(r => r.json())
      .then(setPackages)

    fetch(
      "/api/admin/recovery-item-types"
    )
      .then(r => r.json())
      .then(setItemTypes)

  }, [])

  const loadRooms =
    async (
      package_id: string
    ) => {

      setPackageId(
        package_id
      )

      const res =
        await fetch(
          `/api/admin/recovery-package-rooms?package_id=${package_id}`
        )

      const json =
        await res.json()

      setRooms(json)

    }

  const loadProducts =
    async (
      itemTypeId: string
    ) => {

      setItemTypeId(
        itemTypeId
      )

      const itemType =
        itemTypes.find(
          (i: any) =>
            i.id === itemTypeId
        )

      const res =
        await fetch(
          `/api/admin/recovery-products?category_id=${itemType.category_id}`
        )

      const json =
        await res.json()

      setProducts(json)

    }

  const loadVariants =
    async (
      productId: string
    ) => {

      setProductId(
        productId
      )

      const res =
        await fetch(
          `/api/admin/recovery-variants?product_id=${productId}`
        )

      const json =
        await res.json()

      setVariants(json)

    }

console.log({
  roomId,
  itemTypeId,
  productId,
  variantId,
  qty,
})

  const add =
    async () => {

      const res =
        await fetch(
          "/api/admin/recovery-add-product",
          {
            method: "POST",

            body:
              JSON.stringify({
                package_room_id:
                  roomId,

                item_type_id:
                  itemTypeId,

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
        json.success
      ) {

        alert(
          "Added"
        )

      } else {

        alert(
          json.error
        )

      }

    }

  return (

    <div className="p-10 space-y-6 max-w-5xl">

      <h1 className="text-xl font-bold">
        Package Recovery
      </h1>

      <select
        value={packageId}
        onChange={(e) =>
          loadRooms(
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
          setRoomId(
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
          loadProducts(
            e.target.value
          )
        }
      >

        <option value="">
          Item Type
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

      <select
        value={productId}
        onChange={(e) =>
          loadVariants(
            e.target.value
          )
        }
      >

        <option value="">
          Product
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
      >

        <option value="">
          Variant
        </option>

        {variants.map(
          (v: any) => (

            <option
              key={v.id}
              value={v.id}
            >
              {v.size_label}
               {" | "}
              {v.config}
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
          bg-green-600
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