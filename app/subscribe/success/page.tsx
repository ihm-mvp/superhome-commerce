import Link from "next/link"

export default function SubscribeSuccessPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20 text-center space-y-6">

      <div className="text-3xl font-semibold">
        You're in 🎉
      </div>

      <p className="text-gray-600">
        We've sent you a welcome email with everything you need to get started.
      </p >

      <p className="text-gray-600">
        Explore layouts and furniture packages to plan your move-in setup.
      </p >

      <div className="flex justify-center gap-4 pt-4">

        <Link
          href="/layouts"
          className="px-5 py-3 border rounded-lg text-sm"
        >
          Browse Layouts
        </Link>

        <Link
          href="/packages"
          className="px-5 py-3 bg-black text-white rounded-lg text-sm"
        >
          View Packages
        </Link>

      </div>

    </div>
  )
}