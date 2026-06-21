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

  async function load() {

    setLoading(true)

    const res =
      await fetch(
        "/api/admin/product-editor-load"
      )

    const json =
      await res.json()

    setData(
      json || []
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

      {loading && (
        <div>
          Loading...
        </div>
      )}

      {data.map(
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
                    grid
                    md:grid-cols-4
                    gap-3
                  "
                >

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
                    "
                  />

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

              )
            )}

          </div>

        )
      )}

    </div>

  )

}