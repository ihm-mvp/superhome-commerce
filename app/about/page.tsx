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
          Setting up a home in a new country is harder than it should be.
        </p >
        <p>
          Finding the right layout, sourcing furniture, coordinating delivery — all before you even arrive.
        </p >
        <p>
          MoveInReady exists to simplify that process.
        </p >
      </div>

      {/* Section 2 */}
      <div className="space-y-4 text-gray-600 leading-relaxed">
        <p>
          We help you plan and set up your home before you move in.
        </p >
        <p>
          By combining real New Zealand home layouts with curated furniture packages, we make it possible to:
        </p >
        <ul className="list-disc pl-5 space-y-1">
          <li>Visualise your future home</li>
          <li>Select furniture with confidence</li>
          <li>Avoid weeks of setup after arrival</li>
        </ul>
      </div>

      {/* Section 3 */}
      <div className="space-y-4 text-gray-600 leading-relaxed">
        <p>
          For many of our customers, moving is not just a relocation — it’s a transition.
        </p >
        <p>
          Arriving in a fully prepared home means less stress, more certainty, and a faster start to everyday life.
        </p >
      </div>

      {/* Section 4 */}
      <div className="space-y-4 text-gray-600 leading-relaxed border-t pt-6">
        <p>
          MoveInReady is a platform by SuperMilkBaba (NZ) Limited, based in Christchurch, New Zealand.
        </p >
        <p>
          We work across furniture sourcing, layout planning, and cross-border coordination — connecting supply and real living needs.
        </p >
        <p>
          Our goal is simple: to make moving into a new home as seamless as possible.
        </p >
      </div>

    </div>
  )
}