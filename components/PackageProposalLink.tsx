"use client"

import Link from "next/link"
import {
  useEffect,
  useState,
} from "react"

type Props = {
  slug: string
  leadSource: string
  className: string
  children: React.ReactNode
}

export default function PackageProposalLink({
  slug,
  leadSource,
  className,
  children,
}: Props) {

  const [
    visitorId,
    setVisitorId,
  ] = useState<string | null>(
    null
  )

  useEffect(() => {

    let id =
      localStorage.getItem(
        "mir_visitor_id"
      )

    if (!id) {

      id =
        crypto.randomUUID()

      localStorage.setItem(
        "mir_visitor_id",
        id
      )

    }

    setVisitorId(id)

  }, [])

  if (!visitorId) {

    return null

  }

  return (

    <Link
      href={
        `/package-proposal/${slug}` +
        `?src=${leadSource}` +
        `&visitor_id=${visitorId}`
      }
      className={className}
      prefetch={false}
    >
      {children}
    </Link>

  )

}