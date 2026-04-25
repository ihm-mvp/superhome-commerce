"use client"

import { useState } from "react"

export default function ProductImages({
  images,
}: {
  images: { image_url: string }[]
}) {
  const [active, setActive] = useState(
    images?.[0]?.image_url
  )

  if (!images || images.length === 0) return null

  return (
    <div>

      {/* 主图 */}
      <div className="bg-gray-100 rounded-xl flex items-center justify-center p-6">
        <img
          src={active}
          className="max-h-[400px] object-contain"
        />
      </div>

      {/* 缩略图 */}
      <div className="flex gap-3 mt-4 flex-wrap">
        {images.map((img) => (
          <img
            key={img.image_url}
            src={img.image_url}
            onClick={() => setActive(img.image_url)}
            className={`w-16 h-16 object-contain border rounded-md cursor-pointer 
              ${active === img.image_url ? "border-black" : "border-gray-200"}`}
          />
        ))}
      </div>

    </div>
  )
}