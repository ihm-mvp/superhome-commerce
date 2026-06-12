"use client"

import { useEffect, useState } from "react"

export default function OpeningBuilder() {

  const [
    layouts,
    setLayouts,
  ] = useState<any[]>([])

  const [
    openings,
    setOpenings,
  ] = useState<any[]>([])

  const [
    selectedLayout,
    setSelectedLayout,
  ] = useState("")

  const [
    newOpening,
    setNewOpening,
  ] = useState({

    room_name: "",

    opening_code: "",

    opening_type: "window",

    width_mm: 0,

    height_mm: 0,

    sill_height_mm: 0,

    head_height_mm: 0,

    notes: "",

  })

  useEffect(() => {

    loadLayouts()

  }, [])

  async function loadLayouts() {

    const res =
      await fetch(
        "/api/admin/opening-layouts"
      )

    const data =
      await res.json()

    setLayouts(data)

  }

  async function loadOpenings(
    layoutId: string
  ) {

    const res =
      await fetch(
        `/api/admin/opening-list?layout_id=${layoutId}`
      )

    const data =
      await res.json()

    setOpenings(data)

  }

  async function handleLayoutChange(
    layoutId: string
  ) {

    setSelectedLayout(
      layoutId
    )

    await loadOpenings(
      layoutId
    )

  }

  function updateOpening(
    id: string,
    field: string,
    value: any
  ) {

    setOpenings(
      prev =>
        prev.map(
          (o: any) =>
            o.id === id
              ? {
                  ...o,
                  [field]:
                    value,
                }
              : o
        )
    )

  }

  async function saveOpening(
    opening: any
  ) {

    const res =
      await fetch(
        "/api/admin/opening-update",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify(
              opening
            ),
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
      "Saved"
    )

  }

  async function addOpening() {

    const res =
      await fetch(
        "/api/admin/opening-add",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({

              layout_id:
                selectedLayout,

              ...newOpening,

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

    await loadOpenings(
      selectedLayout
    )

    setNewOpening({

      room_name: "",

      opening_code: "",

      opening_type:
        "window",

      width_mm: 0,

      height_mm: 0,

      sill_height_mm: 0,

      head_height_mm: 0,

      notes: "",

    })

  }

  return (

    <div
      className="
        max-w-7xl
        mx-auto
        p-8
        space-y-8
      "
    >

      <h1
        className="
          text-2xl
          font-semibold
        "
      >
        Opening Builder
      </h1>

      <select
        className="
          border
          p-2
          w-full
        "
        value={
          selectedLayout
        }
        onChange={(
          e
        ) =>
          handleLayoutChange(
            e.target.value
          )
        }
      >

        <option value="">
          Select Layout
        </option>

        {layouts.map(
          (l: any) => (

            <option
              key={l.id}
              value={l.id}
            >
              {l.name}
            </option>

          )
        )}

      </select>

      <div
        className="
          overflow-auto
        "
      >

        <table
          className="
            w-full
            border
          "
        >

          <thead>

            <tr
              className="
                bg-gray-100
              "
            >

              <th className="border p-2">
                Room
              </th>

              <th className="border p-2">
                Code
              </th>

              <th className="border p-2">
                Type
              </th>

              <th className="border p-2">
                Width
              </th>

              <th className="border p-2">
                Height
              </th>

              <th className="border p-2">
                Sill
              </th>

              <th className="border p-2">
                Head
              </th>

              <th className="border p-2">
                Notes
              </th>

              <th className="border p-2">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {openings.map(
              (o: any) => (
                <tr
                  key={o.id}
                >

                  <td className="border p-2">

                    <input
                      className="border p-1 w-full"
                      value={
                        o.room_name || ""
                      }
                      onChange={(e) =>
                        updateOpening(
                          o.id,
                          "room_name",
                          e.target.value
                        )
                      }
                    />

                  </td>

                  <td className="border p-2">

                    <input
                      className="border p-1 w-full"
                      value={
                        o.opening_code || ""
                      }
                      onChange={(e) =>
                        updateOpening(
                          o.id,
                          "opening_code",
                          e.target.value
                        )
                      }
                    />

                  </td>

                  <td className="border p-2">

                    <input
                      className="border p-1 w-full"
                      value={
                        o.opening_type || ""
                      }
                      onChange={(e) =>
                        updateOpening(
                          o.id,
                          "opening_type",
                          e.target.value
                        )
                      }
                    />

                  </td>

                  <td className="border p-2">

                    <input
                      type="number"
                      className="border p-1 w-full"
                      value={
                        o.width_mm || 0
                      }
                      onChange={(e) =>
                        updateOpening(
                          o.id,
                          "width_mm",
                          Number(
                            e.target.value
                          )
                        )
                      }
                    />

                  </td>

                  <td className="border p-2">

                    <input
                      type="number"
                      className="border p-1 w-full"
                      value={
                        o.height_mm || 0
                      }
                      onChange={(e) =>
                        updateOpening(
                          o.id,
                          "height_mm",
                          Number(
                            e.target.value
                          )
                        )
                      }
                    />

                  </td>

                  <td className="border p-2">

                    <input
                      type="number"
                      className="border p-1 w-full"
                      value={
                        o.sill_height_mm || 0
                      }
                      onChange={(e) =>
                        updateOpening(
                          o.id,
                          "sill_height_mm",
                          Number(
                            e.target.value
                          )
                        )
                      }
                    />

                  </td>

                  <td className="border p-2">

                    <input
                      type="number"
                      className="border p-1 w-full"
                      value={
                        o.head_height_mm || 0
                      }
                      onChange={(e) =>
                        updateOpening(
                          o.id,
                          "head_height_mm",
                          Number(
                            e.target.value
                          )
                        )
                      }
                    />

                  </td>

                  <td className="border p-2">

                    <input
                      className="border p-1 w-full"
                      value={
                        o.notes || ""
                      }
                      onChange={(e) =>
                        updateOpening(
                          o.id,
                          "notes",
                          e.target.value
                        )
                      }
                    />

                  </td>

                  <td className="border p-2">

                    <button
                      onClick={() =>
                        saveOpening(
                          o
                        )
                      }
                      className="
                        bg-black
                        text-white
                        px-3
                        py-1
                      "
                    >
                      Save
                    </button>

                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

      <div
        className="
          border
          p-6
          space-y-4
        "
      >

        <h2
          className="
            text-xl
            font-semibold
          "
        >
          Add Opening
        </h2>

        <input
          placeholder="Room Name"
          className="border p-2 w-full"
          value={
            newOpening.room_name
          }
          onChange={(e) =>
            setNewOpening({
              ...newOpening,
              room_name:
                e.target.value,
            })
          }
        />

        <input
          placeholder="Opening Code"
          className="border p-2 w-full"
          value={
            newOpening.opening_code
          }
          onChange={(e) =>
            setNewOpening({
              ...newOpening,
              opening_code:
                e.target.value,
            })
          }
        />

        <input
          placeholder="Opening Type"
          className="border p-2 w-full"
          value={
            newOpening.opening_type
          }
          onChange={(e) =>
            setNewOpening({
              ...newOpening,
              opening_type:
                e.target.value,
            })
          }
        />

        <input
          type="number"
          placeholder="Width"
          className="border p-2 w-full"
          value={
            newOpening.width_mm
          }
          onChange={(e) =>
            setNewOpening({
              ...newOpening,
              width_mm:
                Number(
                  e.target.value
                ),
            })
          }
        />

        <input
          type="number"
          placeholder="Height"
          className="border p-2 w-full"
          value={
            newOpening.height_mm
          }
          onChange={(e) =>
            setNewOpening({
              ...newOpening,
              height_mm:
                Number(
                  e.target.value
                ),
            })
          }
        />

        <input
          type="number"
          placeholder="Sill Height"
          className="border p-2 w-full"
          value={
            newOpening.sill_height_mm
          }
          onChange={(e) =>
            setNewOpening({
              ...newOpening,
              sill_height_mm:
                Number(
                  e.target.value
                ),
            })
          }
        />

        <input
          type="number"
          placeholder="Head Height"
          className="border p-2 w-full"
          value={
            newOpening.head_height_mm
          }
          onChange={(e) =>
            setNewOpening({
              ...newOpening,
              head_height_mm:
                Number(
                  e.target.value
                ),
            })
          }
        />

        <input
          placeholder="Notes"
          className="border p-2 w-full"
          value={
            newOpening.notes
          }
          onChange={(e) =>
            setNewOpening({
              ...newOpening,
              notes:
                e.target.value,
            })
          }
        />

        <button
          onClick={
            addOpening
          }
          className="
            bg-green-600
            text-white
            px-4
            py-2
          "
        >
          Add Opening
        </button>

      </div>

    </div>

  )

}