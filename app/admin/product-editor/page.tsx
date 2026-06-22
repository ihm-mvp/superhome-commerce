"use client"

import {
  useEffect,
  useState,
} from "react"

export default function ProductEditorPage() {

  const [
    data,
    setData,
  ] = useState<any[]>([])

  const [
    loading,
    setLoading,
  ] = useState(false)

  const [
  suppliers,
  setSuppliers,
] = useState<any[]>([])

const [
  categories,
  setCategories,
] = useState<any[]>([])

const [
  supplierId,
  setSupplierId,
] = useState(

  typeof window !==
    "undefined"

    ? localStorage.getItem(
        "product-editor-supplier"
      ) || ""

    : ""

)

const [
  categoryId,
  setCategoryId,
] = useState("")

const [
  keyword,
  setKeyword,
] = useState("")

  async function load() {

    setLoading(true)

    const res =
      await fetch(
        "/api/admin/product-editor-load"
      )

const json =
  await res.json()

setData(
  json.products || []
)

setSuppliers(
  json.suppliers || []
)

setCategories(
  json.categories || []
)

    setLoading(false)

  }

  async function save() {

    const res =
      await fetch(
        "/api/admin/update-product",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({
              data,
            }),
        }
      )

    const json =
      await res.json()

    if (!res.ok) {

      alert(
        json.error
      )

      return

    }

    alert(
      "Saved"
    )

  }

  useEffect(() => {

    load()

  }, [])

  const filteredData =
  data.filter(
    (p: any) => {

      if (
        supplierId &&
        p.supplier_id !== supplierId
      ) {
        return false
      }

      if (
        categoryId &&
        p.category_id !== categoryId
      ) {
        return false
      }

      if (

  keyword &&

  !(
    p.sku_code
      ?.toLowerCase()
      .includes(
        keyword.toLowerCase()
      ) ||

    p.name
      ?.toLowerCase()
      .includes(
        keyword.toLowerCase()
      ) ||

    p.display_name_en
      ?.toLowerCase()
      .includes(
        keyword.toLowerCase()
      )

  )

) {

  return false

}

      return true

    }
  )

  function updateProduct(

    productId: string,

    field: string,

    value: any

  ) {

    setData(

      data.map(
        (p: any) =>

          p.id === productId

            ? {
                ...p,
                [field]:
                  value,
              }

            : p
      )

    )

  }

  function updateVariant(

    productId: string,

    variantId: string,

    field: string,

    value: any

  ) {

    setData(

      data.map(
        (p: any) => {

          if (
            p.id !==
            productId
          ) {
            return p
          }

          return {

            ...p,

            variants:
              p.variants.map(
                (
                  v: any
                ) =>

                  v.id ===
                  variantId

                    ? {
                        ...v,
                        [field]:
                          value,
                      }

                    : v
              ),

          }

        }
      )

    )

  }

  return (

    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">

      <div className="flex justify-between items-center">

        <h1 className="text-3xl font-semibold">
          Product Editor
        </h1>

        <button
          onClick={save}
          className="
            bg-black
            text-white
            px-6
            py-3
            rounded-lg
          "
        >
          Save
        </button>

      </div>

<div
  className="
    flex
    gap-4
  "
>

  <select
    value={supplierId}
onChange={(e) => {

  setSupplierId(
    e.target.value
  )

  localStorage.setItem(
    "product-editor-supplier",
    e.target.value
  )

}}
    className="
      border
      p-2
      min-w-[240px]
    "
  >

    <option value="">
      All Suppliers
    </option>

    {suppliers.map(
      (s: any) => (

        <option
          key={s.id}
          value={s.id}
        >
          {s.name}
        </option>

      )
    )}

  </select>

  <select
    value={categoryId}
    onChange={(e) =>
      setCategoryId(
        e.target.value
      )
    }
    className="
      border
      p-2
      min-w-[240px]
    "
  >

    <option value="">
      All Categories
    </option>

    {categories.map(
      (c: any) => (

        <option
          key={c.id}
          value={c.id}
        >
          {c.name}
        </option>

      )
    )}

  </select>

  <input
  value={keyword}
  onChange={(e) =>
    setKeyword(
      e.target.value
    )
  }
  placeholder="Search SKU"
  className="
    border
    p-2
    min-w-[240px]
  "
/>

</div>

      {loading && (
        <div>
          Loading...
        </div>
      )}

{filteredData.map(
        (product: any) => (

          <div
            key={product.id}
            className="
              border
              rounded-xl
              p-5
              bg-white
              space-y-4
            "
          >

            <div className="border-b pb-3">

<div className="flex justify-between">

  <div className="font-semibold text-lg">

    {product.sku_code}

  </div>

  <div className="text-sm text-gray-500">

    {product.variants?.length || 0}

    {" Variants"}

  </div>

</div>

  <div className="text-sm text-gray-500">

    {product.supplier?.name}

    {" · "}

    {product.category?.name}

  </div>

</div>

<div className="text-xs text-gray-400">

  {product.id}

</div>

            {/* Product */}

            <div className="grid md:grid-cols-2 gap-3">

              <input
                value={
                  product.sku_code || ""
                }
                onChange={(e) =>
                  updateProduct(
                    product.id,
                    "sku_code",
                    e.target.value
                  )
                }
                className="
                  border
                  p-2
                "
              />

              <input
                value={
                  product.name || ""
                }
                onChange={(e) =>
                  updateProduct(
                    product.id,
                    "name",
                    e.target.value
                  )
                }
                className="
                  border
                  p-2
                "
              />

              <input
                value={
                  product.display_name_en || ""
                }
                onChange={(e) =>
                  updateProduct(
                    product.id,
                    "display_name_en",
                    e.target.value
                  )
                }
                className="
                  border
                  p-2
                "
              />

            </div>

            <textarea
              value={
                product.display_description_en || ""
              }
              onChange={(e) =>
                updateProduct(
                  product.id,
                  "display_description_en",
                  e.target.value
                )
              }
              className="
                border
                p-2
                w-full
                min-h-[80px]
              "
            />

            {/* Variants */}

            {product.variants?.map(
              (variant: any) => (

<div
  key={variant.id}
  className="
    border-t
    pt-4
    space-y-3
  "
>

  <div className="text-sm font-medium text-blue-600">
    Variant
  </div>

  <div
    className="
      grid
      grid-cols-4
      gap-4
    "
  >

    <div className="text-sm font-medium text-blue-600">
  Variant
</div>

<div>

  <div className="text-sm font-medium text-blue-600">
    Size Label
  </div>

  <input
    value={
      variant.size_label || ""
    }
                    onChange={(e) =>
                      updateVariant(
                        product.id,
                        variant.id,
                        "size_label",
                        e.target.value
                      )
                    }
                    className="
                      border
                      p-2
                    "
                  />

    </div>

<div>

  <div className="text-sm font-medium text-blue-600">
    Config
  </div>

                  <input
                    value={
                      variant.config || ""
                    }
                    onChange={(e) =>
                      updateVariant(
                        product.id,
                        variant.id,
                        "config",
                        e.target.value
                      )
                    }
                    className="
                      border
                      p-2
                    "
                  />
                  </div>

                  <div>

  <div className="text-sm font-medium text-blue-600">
    Price RMB
  </div>

                  <input
                    type="number"
                    value={
                      variant.price_rmb || 0
                    }
                    onChange={(e) =>
                      updateVariant(
                        product.id,
                        variant.id,
                        "price_rmb",
                        Number(
                          e.target.value
                        )
                      )
                    }
className="
  border
  p-2
  bg-yellow-50
  font-semibold
"
                  />
                  </div>

                  <div>

  <div className="text-sm font-medium text-blue-600">
    Display Config English
  </div>

                  <input
                    value={
                      variant.display_config_en || ""
                    }
                    onChange={(e) =>
                      updateVariant(
                        product.id,
                        variant.id,
                        "display_config_en",
                        e.target.value
                      )
                    }
                    className="
                      border
                      p-2
                    "
                  />
                  </div>

                  <div>

  <div className="text-sm font-medium text-blue-600">
    Width mm
  </div>

                  <input
                    type="number"
                    value={
                      variant.width_mm || 0
                    }
                    onChange={(e) =>
                      updateVariant(
                        product.id,
                        variant.id,
                        "width_mm",
                        Number(
                          e.target.value
                        )
                      )
                    }
                    className="
                      border
                      p-2
                    "
                  />
                  </div>

                  <div>

  <div className="text-sm font-medium text-blue-600">
    Length mm
  </div>

                  <input
                    type="number"
                    value={
                      variant.length_mm || 0
                    }
                    onChange={(e) =>
                      updateVariant(
                        product.id,
                        variant.id,
                        "length_mm",
                        Number(
                          e.target.value
                        )
                      )
                    }
                    className="
                      border
                      p-2
                    "
                  />
                  </div>

                  <div>

  <div className="text-sm font-medium text-blue-600">
    Height mm
  </div>

                  <input
                    type="number"
                    value={
                      variant.height_mm || 0
                    }
                    onChange={(e) =>
                      updateVariant(
                        product.id,
                        variant.id,
                        "height_mm",
                        Number(
                          e.target.value
                        )
                      )
                    }
                    className="
                      border
                      p-2
                    "
                  />
                  </div>

                  <div>

  <div className="text-sm font-medium text-blue-600">
    Display Note English
  </div>

                  <input
                    value={
                      variant.display_note_en || ""
                    }
                    onChange={(e) =>
                      updateVariant(
                        product.id,
                        variant.id,
                        "display_note_en",
                        e.target.value
                      )
                    }
                    className="
                      border
                      p-2
                    "
                  />
                  </div>

                </div>
                </div>

              )
            )}

          </div>

        )
      )}

    </div>

  )

}