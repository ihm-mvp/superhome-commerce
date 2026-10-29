"use client"

import { useState, useEffect } from "react"

export default function ProductImages({
images,
}: {
images: { image_url: string }[]
}) {
const [active, setActive] = useState(images?.[0]?.image_url)
const [isZoomed, setIsZoomed] = useState(false)

const currentIndex = images.findIndex(
(img) => img.image_url === active
)

const showPrevious = () => {
const previousIndex =
(currentIndex - 1 + images.length) % images.length
setActive(images[previousIndex].image_url)
}

const showNext = () => {
const nextIndex = (currentIndex + 1) % images.length
setActive(images[nextIndex].image_url)
}

useEffect(() => {
if (!isZoomed) return

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === "Escape") setIsZoomed(false)
  if (event.key === "ArrowLeft") showPrevious()
  if (event.key === "ArrowRight") showNext()
}

document.addEventListener("keydown", handleKeyDown)
document.body.style.overflow = "hidden"

return () => {
  document.removeEventListener("keydown", handleKeyDown)
  document.body.style.overflow = ""
}

}, [isZoomed, active, images])

if (!images || images.length === 0) return null

return (
<div>
{/* 主图：点击放大 */}
<div className="bg-gray-100 rounded-xl flex items-center justify-center p-6">
<img
src={active}
alt="Product image"
onClick={() => setIsZoomed(true)}
className="max-h-[400px] object-contain cursor-zoom-in"
/>
</div>

  {/* 缩略图 */}
  <div className="flex gap-3 mt-4 flex-wrap">
    {images.map((img) => (
      <img
        key={img.image_url}
        src={img.image_url}
        alt="Product thumbnail"
        onClick={() => setActive(img.image_url)}
        className={`w-16 h-16 object-contain border rounded-md cursor-pointer
          ${
            active === img.image_url
              ? "border-black"
              : "border-gray-200"
          }`}
      />
    ))}
  </div>

  {/* 放大浏览窗口 */}
  {isZoomed && (
    <div
      className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4"
      onClick={() => setIsZoomed(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Product image viewer"
    >
      {/* 关闭按钮 */}
      <button
        type="button"
        onClick={() => setIsZoomed(false)}
        className="absolute top-5 right-5 text-white text-4xl leading-none p-2"
        aria-label="Close image viewer"
      >
        ×
      </button>

      {/* 上一张 */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            showPrevious()
          }}
          className="absolute left-3 md:left-8 text-white text-4xl p-3"
          aria-label="Previous image"
        >
          ‹
        </button>
      )}

      {/* 放大图片 */}
      <img
        src={active}
        alt="Enlarged product image"
        onClick={(event) => event.stopPropagation()}
        className="max-w-[90vw] max-h-[90vh] object-contain cursor-default"
      />

      {/* 下一张 */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            showNext()
          }}
          className="absolute right-3 md:right-8 text-white text-4xl p-3"
          aria-label="Next image"
        >
          ›
        </button>
      )}

      {/* 图片序号 */}
      <div className="absolute bottom-4 text-white text-sm">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  )}
</div>

)
}