"use client"

import {
  useEffect,
  useState,
} from "react"

export default function FurnitureEditor() {

  const [
    packages,
    setPackages,
  ] = useState<any[]>([])

  const [
    packageId,
    setPackageId,
  ] = useState("")

  const [
    data,
    setData,
  ] = useState<any[]>([])

  const [
    loading,
    setLoading,
  ] = useState(false)

  useEffect(() => {

    loadPackages()

  }, [])

  async function loadPackages() {

    const res =
      await fetch(
        "/api/admin/furniture-editor-packages"
      )

    const json =
      await res.json()

    setPackages(
      json || []
    )

  }

  async function load() {

    if (!packageId) {

      alert(
        "Please select package"
      )

      return

    }

    setLoading(true)

    const res =
      await fetch(
        `/api/admin/furniture-editor-load?package_id=${packageId}`
      )

    const json =
      await res.json()

    setData(
      json || []
    )

    setLoading(false)

  }

  function handleChange(
    pipId: string,
    value: any
  ) {

    setData(
      (prev: any[]) =>
        prev.map(
          (room: any) => ({

            ...room,

            items:
              room.items.map(
                (
                  item: any
                ) => ({

                  ...item,

                  pips:
                    item.pips.map(
                      (
                        p: any
                      ) =>

                        p.id === pipId

                          ? {
                              ...p,
                              ...value,
                            }

                          : p

                    ),

                })
              ),

          })
        )
    )

  }

  async function save() {

    const res =
      await fetch(
        "/api/admin/update-package-products",
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

    if (
      !res.ok
    ) {

      alert(
        json.error
      )

      return

    }

    alert(
      "Saved"
    )

  }

  return (

    <div
      className="
        max-w-6xl
        mx-auto
        p-8
        space-y-8
      "
    >

      <div>

        <h1
          className="
            text-3xl
            font-semibold
          "
        >
          Furniture Editor
        </h1>

        <div
          className="
            text-gray-500
            mt-2
          "
        >
          Modify furniture products
          without changing package
          structure.
        </div>

      </div>

      <div
        className="
          flex
          gap-4
          items-center
        "
      >

        <select
          value={packageId}
          onChange={(e) =>
            setPackageId(
              e.target.value
            )
          }
          className="
            border
            p-2
            min-w-[320px]
          "
        >

          <option value="">
            Select Package
          </option>

          {packages.map(
            (pkg: any) => (

              <option
                key={pkg.id}
                value={pkg.id}
              >
                {
                  pkg.layout?.name
                }
                {" | "}
                {pkg.name}
              </option>

            )
          )}

        </select>

        <button
          onClick={load}
          className="
            bg-black
            text-white
            px-4
            py-2
          "
        >
          Load
        </button>

      </div>

      {loading && (

        <div>
          Loading...
        </div>

      )}
      {data.map(
        (room: any) => (

          <div
            key={room.id}
            className="
              border
              rounded-xl
              p-5
              bg-white
            "
          >

            <div
              className="
                text-xl
                font-semibold
                mb-4
              "
            >
              {room.name}
            </div>

            {room.items.map(
              (item: any) => (

                <div
                  key={item.id}
                  className="
                    mb-6
                    border-b
                    pb-4
                  "
                >

                  <div
                    className="
                      text-sm
                      text-gray-500
                      mb-3
                    "
                  >
                    {
                      item.item_type_name
                    }
                  </div>

                  {item.pips.map(
                    (p: any) => (

                      <div
                        key={p.id}
                        className="
                          grid
                          md:grid-cols-4
                          gap-3
                          mb-3
                        "
                      >

                        {/* Product */}

                        <select
                          value={
                            p.product_id
                          }
                          onChange={(
                            e
                          ) => {

                            const selected =
                              p.options.find(
                                (
                                  o: any
                                ) =>
                                  o.id ===
                                  e.target
                                    .value
                              )

                            handleChange(
                              p.id,
                              {

                                product_id:
                                  selected.id,

                                variant_id:
                                  selected
                                    ?.variants?.[0]
                                    ?.id || null,

                              }
                            )

                          }}
                          className="
                            border
                            p-2
                          "
                        >

                          {p.options.map(
                            (
                              option: any
                            ) => (

                              <option
                                key={
                                  option.id
                                }
                                value={
                                  option.id
                                }
                              >
                                {
                                  option.sku_code
                                }
                                {" | "}
                                {
                                  option.name
                                }
                              </option>

                            )
                          )}

                        </select>

                        {/* Variant */}

                        <select
                          value={
                            p.variant_id ||
                            ""
                          }
                          onChange={(
                            e
                          ) =>

                            handleChange(
                              p.id,
                              {
                                variant_id:
                                  e.target
                                    .value,
                              }
                            )

                          }
                          className="
                            border
                            p-2
                          "
                        >

                          {p.options
                            .find(
                              (
                                option: any
                              ) =>
                                option.id ===
                                p.product_id
                            )
                            ?.variants.map(
                              (
                                variant: any
                              ) => (

                                <option
                                  key={
                                    variant.id
                                  }
                                  value={
                                    variant.id
                                  }
                                >
                                  {
                                    variant.size_label
                                  }
                                  {" | "}
                                  {
                                    variant.config
                                  }
                                </option>

                              )
                            )}

                        </select>

{/* Quantity */}

<input
  type="number"
  min="1"
  value={p.quantity || 1}
  onChange={(e) =>

    handleChange(
      p.id,
      {
        quantity:
          Number(
            e.target.value
          ),
      }
    )

  }
  className="
    border
    p-2
    w-24
  "
/>

{/* Opening */}

<select
  value={
    p.opening_id || ""
  }
  onChange={(e) =>

    handleChange(
      p.id,
      {
        opening_id:
          e.target.value || null,
      }
    )

  }
  className="
    border
    p-2
  "
>

  <option value="">
    No Opening
  </option>

  {p.openings?.map(
    (o: any) => (

      <option
        key={o.id}
        value={o.id}
      >
        {o.room_name}
        {" | "}
        {o.opening_code}
      </option>

    )
  )}

</select>

                      </div>

                    )
                  )}

                </div>

              )
            )}

          </div>

        )
      )}

      {data.length > 0 && (

        <button
          onClick={save}
          className="
            bg-green-600
            text-white
            px-6
            py-3
            rounded-lg
          "
        >
          Save Changes
        </button>

      )}

    </div>

  )

}