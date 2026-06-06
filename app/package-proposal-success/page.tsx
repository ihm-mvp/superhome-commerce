import Link from "next/link"

export default function PackageProposalSuccessPage() {
  return (

    <div className="max-w-3xl mx-auto px-6 py-20">

      <div className="border rounded-2xl p-10 text-center">

        <div className="text-5xl mb-6">
          ✓
        </div>

        <h1 className="text-4xl font-semibold mb-4">
          Proposal Sent Successfully
        </h1>

        <p className="text-gray-600 leading-relaxed max-w-xl mx-auto">
          Your package proposal has been sent to your email address.
        </p >

        <p className="text-gray-600 leading-relaxed mt-3 max-w-xl mx-auto">
          Please check your inbox and spam folder if you do not receive it within a few minutes.
        </p >

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">

          <Link
            href="/packages"
            className="
              inline-flex
              items-center
              justify-center
              px-6
              py-3
              bg-black
              text-white
              rounded-lg
              hover:opacity-90
              transition
            "
          >
            View More Packages
          </Link>

          <Link
            href="/layouts"
            className="
              inline-flex
              items-center
              justify-center
              px-6
              py-3
              border
              rounded-lg
              hover:bg-gray-50
              transition
            "
          >
            Explore Layouts
          </Link>

        </div>

      </div>

    </div>

  )
}