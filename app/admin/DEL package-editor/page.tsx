"use client"

import { useState } from "react"

export default function PackageEditor() {

  const [packageId, setPackageId] =
    useState("")

  const [data, setData] =
    useState<any[]>([])

  const load = async () => {

    const res =
      await fetch(
        `/api/admin/package-full?package_id=${packageId}`
      )

    const json =
      await res.json()

    setData(json)

  }

  const handleChange = (
    pipId: string,
    field: string,
    value: any
  ) => {

    setData((prev) =>
      prev.map((room) => ({
        ...room,

        items:
          room.items.map(
            (item: any) => ({
              ...item,

              pips:
                item.pips.map(
                  (p: any) =>
                    p.id === pipId
                      ? {
                          ...p,
                          ...value,
                        }
                      : p
                ),

            })
          ),

      }))
    )

  }


  
  const deleteProduct =
    async (
      pipId: string,
      itemId: string
    ) => {

console.log(
  "DELETE CLICKED",
  pipId,
  itemId
)

      await fetch(
        "/api/admin/delete-package-product",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({
              pipId,
              itemId,
            }),
        }
      )

      setData((prev) =>
        prev.map((room) => ({

          ...room,

          items:
            room.items
              .map(
                (item: any) => ({

                  ...item,

                  pips:
                    item.pips.filter(
                      (p: any) =>
                        p.id !== pipId
                    ),

                })
              )
              .filter(
                (item: any) =>
                  item.pips.length > 0
              ),

        }))
      )

    }

  const save = async () => {

    await fetch(
      "/api/admin/update-package-products",
      {
        method: "POST",

        body:
          JSON.stringify({
            data,
          }),
      }
    )

    alert("Saved")

  }

  return (

    <div className="p-10 space-y-6 max-w-5xl">

      <input
        placeholder="package_id"
        className="
          border
          p-2
          w-full
        "
        value={packageId}
        onChange={(e) =>
          setPackageId(
            e.target.value
          )
        }
      />

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

      {data.map(
        (room: any) => (

          <div
            key={room.name}
            className="
              border
              p-4
            "
          >

            <div
              className="
                font-semibold
                mb-3
              "
            >
              {room.name}
            </div>

            {room.items.map(
              (item: any) => (

                <div
                  key={item.id}
                  className="mb-4"
                >

                  <div
                    className="
                      text-sm
                      text-gray-500
                      mb-1
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
                          flex
                          gap-3
                          items-center
                          mb-1
                        "
                      >

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
                              "product",
                              {

                                product_id:
                                  selected.id,

                                variant_id:
                                  selected
                                    .variants[0]
                                    ?.id,

                              }
                            )

                          }}
                        >

                          {p.options.map(
                            (
                              o: any
                            ) => (

                              <option
                                key={
                                  o.id
                                }
                                value={
                                  o.id
                                }
                              >
  {o.sku_code}
  {" | "}
  {o.name}
  {" | "}
  {o.description}
                              </option>

                            )
                          )}

                        </select>

                        <select
                          value={
                            p.variant_id ||
                            ""
                          }
                          onChange={(
                            e
                          ) => {

                            const selectedSku =
                              p.options.find(
                                (
                                  o: any
                                ) =>
                                  o.id ===
                                  p.product_id
                              )

                            const v =
                              selectedSku?.variants.find(
                                (
                                  v: any
                                ) =>
                                  v.id ===
                                  e.target
                                    .value
                              )

                            handleChange(
                              p.id,
                              "variant",
                              {
                                variant_id:
                                  v.id,
                              }
                            )

                          }}
                        >

                          {p.options
                            .find(
                              (
                                o: any
                              ) =>
                                o.id ===
                                p.product_id
                            )
                            ?.variants.map(
                              (
                                v: any
                              ) => (

                                <option
                                  key={
                                    v.id
                                  }
                                  value={
                                    v.id
                                  }
                                >
                                  {
                                    v.config
                                  }
                                </option>

                              )
                            )}

                        </select>

                        <button

                          onClick={() =>
                            deleteProduct(
                              p.id,
                              p.item_id
                            )
                          }

                          className="
                            bg-red-600
                            text-white
                            px-2
                            py-1
                            text-xs
                          "
                        >

                          Delete

                        </button>

                      </div>

                    )
                  )}

                </div>

              )
            )}

          </div>

        )
      )}

      <button
        onClick={save}
        className="
          bg-green-600
          text-white
          px-4
          py-2
        "
      >
        Save
      </button>

    </div>

  )

}