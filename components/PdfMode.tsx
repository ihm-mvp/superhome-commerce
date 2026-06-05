"use client"

import { useSearchParams } from "next/navigation"

export default function PdfMode({
  children,
}: {
  children: React.ReactNode
}) {

  const searchParams =
    useSearchParams()

  const isPdf =
    searchParams.get("pdf") === "1"

  if (isPdf) {
    return null
  }

  return <>{children}</>

}