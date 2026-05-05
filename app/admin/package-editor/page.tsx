"use client"

import { useState } from "react"

export default function PackageEditor() {
  const [packageId, setPackageId] = useState("")
  const [data, setData] = useState<any[]>([])

  const load = async () => {
    const res = await fetch(`/api/admin/package-full?package_id=${packageId}`)
    const json = await res.json()
    setData(json)
  }

  const handleChange = (pipId: string, field: string, value: string) => {
    setData((prev) =>
      prev.map((room) => ({
        ...room,
        items: room.items.map((item: any) => ({
          ...item,
          pips: item.pips.map((p: any) =>
            p.id === pipId ? { ...p, [field]: value } : p
          ),
        })),
      }))
    )
  }

  const save = async () => {
    await fetch("/api/admin/update-package-products", {
      method: "POST",
      body: JSON.stringify({ data }),
    })
    alert("Saved")
  }

  return (
    <div className="p-10 space-y-6">

      <input
        placeholder="package_id"
        className="border p-2"
        value={packageId}
        onChange={(e) => setPackageId(e.target.value)}
      />

      <button onClick={load} className="bg-black text-white px-4 py-2">
        Load
      </button>

      {data.map((room: any) => (
        <div key={room.name} className="border p-4">
          <div className="font-semibold mb-2">{room.name}</div>

          {room.items.map((item: any) => (
            <div key={item.id} className="mb-3">

              <div className="text-sm text-gray-500">
                {item.item_type_name}
              </div>

              {item.pips.map((p: any) => (
                <div key={p.id} className="flex gap-2 mt-1">

                  <input
                    value={p.product_id}
                    onChange={(e) =>
                      handleChange(p.id, "product_id", e.target.value)
                    }
                    className="border px-2 py-1 text-xs"
                  />

                  <input
                    value={p.variant_id}
                    onChange={(e) =>
                      handleChange(p.id, "variant_id", e.target.value)
                    }
                    className="border px-2 py-1 text-xs"
                  />

                </div>
              ))}

            </div>
          ))}
        </div>
      ))}

      <button onClick={save} className="bg-green-600 text-white px-4 py-2">
        Save
      </button>

    </div>
  )
}