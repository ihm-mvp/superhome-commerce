"use client"

import { useEffect, useState } from "react"

export default function PackageBuilder() {
  const [layouts, setLayouts] = useState<any[]>([])
  const [packages, setPackages] = useState<any[]>([])
  const [selectedLayout, setSelectedLayout] = useState("")
  const [selectedPackage, setSelectedPackage] = useState("")
  const [structure, setStructure] = useState<any[]>([])
  const [newName, setNewName] = useState("")
  const [loading, setLoading] = useState(false)

  // 获取 layouts
  useEffect(() => {
    fetch("/api/admin/layouts")
      .then(res => res.json())
      .then(setLayouts)
  }, [])

  // 获取 packages
  useEffect(() => {
    if (!selectedLayout) return

    fetch(`/api/admin/packages?layout_id=${selectedLayout}`)
      .then(res => res.json())
      .then(setPackages)
  }, [selectedLayout])

  // 加载结构（Standard）
  const loadStructure = async () => {
    const res = await fetch(`/api/admin/package-structure?package_id=${selectedPackage}`)
    const data = await res.json()
    setStructure(data)
  }

  // 保存新 package
  const handleSave = async () => {
    setLoading(true)

    await fetch("/api/admin/clone-package", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source_package_id: selectedPackage,
        name: newName,
      }),
    })

    alert("Package created")
    setLoading(false)
  }

  return (
    <div className="p-10 space-y-6 max-w-3xl">

      <h1 className="text-xl font-semibold">Package Builder</h1>

      {/* Layout */}
      <div>
        <div className="text-sm mb-1">Layout</div>
        <select
          className="border p-2 w-full"
          onChange={(e) => setSelectedLayout(e.target.value)}
        >
          <option value="">Select layout</option>
          {layouts.map((l) => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>
      </div>

      {/* Package */}
      <div>
        <div className="text-sm mb-1">Template (Standard)</div>
        <select
          className="border p-2 w-full"
          onChange={(e) => setSelectedPackage(e.target.value)}
        >
          <option value="">Select package</option>
          {packages.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      <button
        onClick={loadStructure}
        className="px-4 py-2 bg-black text-white"
      >
        Load Structure
      </button>

      {/* Structure */}
      <div className="space-y-4">
        {structure.map((room: any) => (
          <div key={room.name} className="border p-3">
            <div className="font-medium mb-2">{room.name}</div>

            {room.items.map((item: any) => (
              <div key={item.id} className="text-sm text-gray-600">
                {item.product_name} ({item.variant})
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* New package */}
      <div>
        <input
          placeholder="New package name (Basic / Premium)"
          className="border p-2 w-full"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        className="px-4 py-2 bg-green-600 text-white"
      >
        {loading ? "Saving..." : "Create Package"}
      </button>

    </div>
  )
}