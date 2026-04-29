"use client"

import { useState } from "react"

export default function EmailCapture({ source = "unknown" }) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    setError("")

    // ===== 基础校验 =====
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          source,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong")
      }

      setSuccess(true)
      setEmail("")

    } catch (err: any) {
      setError(err.message || "Failed to subscribe")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">

      {/* Input Row */}
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          className="border px-3 py-2 rounded w-full text-sm focus:outline-none focus:ring-1 focus:ring-black"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-black text-white px-4 rounded text-sm disabled:opacity-50"
        >
          {loading ? "..." : "Join"}
        </button>
      </div>

      {/* Success */}
      {success && (
        <div className="text-xs text-green-600">
          ✓ You're subscribed
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-xs text-red-500">
          {error}
        </div>
      )}

    </div>
  )
}