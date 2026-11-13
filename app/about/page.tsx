
import Link from "next/link"

export const metadata = {
  title:
    "About MoveInReady | Home Products & Move-In Solutions NZ",

  description:
    "Discover MoveInReady — a New Zealand home products and move-in solutions platform. Explore complete home furnishing packages based on real home layouts, or shop individual furniture and smart home products.",

  keywords: [
    "MoveInReady",
    "About MoveInReady",
    "Home Products NZ",
    "Move-In Solutions NZ",
    "Furniture Packages NZ",
    "Smart Home Products NZ",
    "New Zealand Home Furnishing",
    "Christchurch Furniture",
  ],
}

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 space-y-12">

      {/* TITLE */}
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold">
          About MoveInReady
        </h1>

        <p className="text-xl text-gray-700 leading-relaxed">
          Making your home ready for living.
        </p >

        <p className="text-gray-600 leading-relaxed">
          MoveInReady is built around a simple idea:
          making it easier to prepare, furnish and improve
          your home — so you can enjoy it from day one.
        </p >
      </div>

      {/* SECTION 1 */}
      <div className="space-y-4 text-gray-600 leading-relaxed">

        <h2 className="text-xl font-semibold text-black">
          What Does MoveInReady Mean?
        </h2>

        <p>
          Setting up a home should be exciting, but choosing
          furniture, finding the right products, coordinating
          purchases and arranging delivery can quickly become
          complicated and time-consuming.
        </p >

        <p>
          MoveInReady brings these needs together in one
          platform. Whether you are preparing an entire home
          or looking for individual products, our goal is to
          make the process simpler.
        </p >

        <p>
          From complete home furnishing solutions to the
          details that make everyday living better,
          MoveInReady helps turn a house into a home.
        </p >

      </div>

      {/* SECTION 2 */}
      <div className="space-y-6">

        <h2 className="text-xl font-semibold text-black">
          Two Ways to Make Your Home MoveInReady
        </h2>

        <div className="space-y-3 text-gray-600 leading-relaxed">

          <h3 className="font-semibold text-black">
            1. Complete Home Solutions
          </h3>

          <p>
            Explore real New Zealand home layouts and
            discover furniture packages designed around
            specific homes and room configurations.
          </p >

          <p>
            From furniture selection to furnishing concepts,
            MoveInReady helps you plan and prepare your home
            before moving in.
          </p >

          <Link
            href="/layouts"
            className="inline-block text-sm font-medium text-black underline underline-offset-4"
            prefetch={false}
          >
            Explore Home Layouts →
          </Link>

        </div>

        <div className="border-t pt-5 space-y-3 text-gray-600 leading-relaxed">

          <h3 className="font-semibold text-black">
            2. Individual Home Products
          </h3>

          <p>
            Not every home needs a complete furnishing
            package. Sometimes, you simply want to find
            the right piece of furniture or a product
            that makes everyday life easier.
          </p >

          <p>
            Our product collection extends beyond furniture
            to include Better Life products, such as smart
            home technology and practical innovations
            for modern living.
          </p >

          <Link
            href="/products"
            className="inline-block text-sm font-medium text-black underline underline-offset-4"
            prefetch={false}
          >
            Explore Home Products →
          </Link>

        </div>

      </div>

      {/* SECTION 3 */}
      <div className="space-y-4 text-gray-600 leading-relaxed">

        <h2 className="text-xl font-semibold text-black">
          Designed for Better Everyday Living
        </h2>

        <p>
          Whether you are moving into a new build,
          furnishing your current home, or looking for
          practical products to improve your living
          environment, the goal is the same:
        </p >

        <ul className="list-disc pl-5 space-y-2">
          <li>Make better home furnishing decisions</li>
          <li>Save time sourcing products and solutions</li>
          <li>Discover products that improve everyday living</li>
          <li>Enjoy a simpler move-in and home setup experience</li>
        </ul>

      </div>

      {/* SECTION 4 */}
      <div className="space-y-4 text-gray-600 leading-relaxed border-t pt-8">

        <h2 className="text-xl font-semibold text-black">
About Our Company
        </h2>

        <p>
          MoveInReady is a platform by SuperMilkBaba (NZ)
          Limited, based in Christchurch, New Zealand.
        </p >

        <p>
          We combine New Zealand market understanding,
          home furnishing experience and cross-border
          supply chain capabilities to connect customers
          with practical home products and solutions.
        </p >

        <p>
          Our focus is on making quality home products
          more accessible and creating a more convenient
          way for people to prepare and improve their homes.
        </p >

      </div>

      {/* FINAL STATEMENT */}
      <div className="border-t pt-8 space-y-3">

        <h2 className="text-2xl font-semibold text-black">
          Make Your Home MoveInReady.
        </h2>

        <p className="text-gray-600 leading-relaxed">
          From complete home solutions to individual
          products, discover a smarter way to make
          your home ready for living.
        </p >

        <div className="flex flex-wrap gap-3 pt-3">

          <Link
            href="/layouts"
            className="px-5 py-3 bg-black text-white rounded-lg text-sm font-medium"
            prefetch={false}
          >
            Explore Home Layouts
          </Link>

          <Link
            href="/products"
            className="px-5 py-3 border rounded-lg text-sm font-medium"
            prefetch={false}
          >
            Shop Home Products
          </Link>

        </div>

      </div>

    </div>
  )
}
 