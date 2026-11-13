export const metadata = {
  title: "About MoveInReady | Move-in Ready Furniture Packages NZ",
  description:
    "MoveInReady helps you set up your home before you move in. Explore real New Zealand home layouts and complete furniture packages designed for modern living.",
}

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 space-y-10">

      {/* Title */}
      <h1 className="text-3xl font-semibold">
        About MoveInReady
      </h1>

      {/* Section 1 */}
      <div className="space-y-4 text-gray-600 leading-relaxed">
        <p>
          Setting up a new home should be simple — but it rarely is.
        </p >
        <p>
          Choosing the right layout, sourcing furniture, coordinating delivery and installation — all while managing a move — can quickly become overwhelming.
        </p >
        <p>
          MoveInReady exists to simplify that process.
        </p >
      </div>

      {/* Section 2 */}
      <div className="space-y-4 text-gray-600 leading-relaxed">
        <p>
          We help homeowners across New Zealand plan and set up their homes before they move in.
        </p >
        <p>
          By combining real New Zealand home layouts with curated furniture packages, we make it possible to:
        </p >
        <ul className="list-disc pl-5 space-y-1">
          <li>Visualise your home with real layouts</li>
          <li>Select complete furniture packages with confidence</li>
          <li>Move into a fully furnished, move-in ready home</li>
        </ul>
      </div>

      {/* Section 3 */}
      <div className="space-y-4 text-gray-600 leading-relaxed">
        <p>
          Whether you're moving into a new build, upgrading your current home, or preparing a property for living or rental, the goal is the same:
        </p >
        <p>
          Reduce uncertainty, save time, and make better decisions before move-in day.
        </p >
        <p>
          A well-prepared home means less stress, fewer delays, and a smoother start to everyday life.
        </p >
      </div>

      {/* Section 4 */}
      <div className="space-y-4 text-gray-600 leading-relaxed border-t pt-6">
        <p>
          MoveInReady is a platform by SuperMilkBaba (NZ) Limited, based in Christchurch, New Zealand.
        </p >
        <p>
          We bring together home layout planning, furniture sourcing, and cross-border supply chain capabilities — connecting real homes with practical, ready-to-use furniture solutions.
        </p >
        <p>
          Our goal is simple: to make every home move-in ready.
        </p >
      </div>

    </div>
  )
}