
import "./globals.css"
import Link from "next/link"
import EmailCapture from "@/components/EmailCapture"

export const metadata = {
  title: {
    default: "MoveInReady | Home Products & Move-In Solutions NZ",
    template: "%s | MoveInReady",
  },
  description:
    "MoveInReady helps you prepare and improve your home. Explore real New Zealand home layouts, complete furnishing solutions, furniture and smart home products.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white text-black">

        {/* ===== HEADER ===== */}
        <header className="border-b bg-white sticky top-0 z-50">

          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-3">

            {/* Logo */}
            <Link
              href="/"
              className="flex flex-col leading-tight shrink-0"
              prefetch={false}
            >
              <span className="font-semibold text-lg">
                MoveInReady
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">

              <Link
                href="/layouts"
                className="hover:text-black transition"
                prefetch={false}
              >
                Home Layouts
              </Link>

              <Link
                href="/packages"
                className="hover:text-black transition"
                prefetch={false}
              >
                Packages
              </Link>

              <Link
                href="/products"
                className="hover:text-black transition"
                prefetch={false}
              >
                Shop Products
              </Link>

              <Link
                href="/about"
                className="hover:text-black transition"
                prefetch={false}
              >
                About
              </Link>

            </nav>

            {/* Mobile Navigation */}
            <div className="flex md:hidden items-center gap-2">

              <Link
                href="/layouts"
                className="px-3 py-2 border rounded-lg text-xs font-medium whitespace-nowrap"
                prefetch={false}
              >
                Layouts
              </Link>

              <Link
                href="/products"
                className="px-3 py-2 bg-black text-white rounded-lg text-xs font-medium whitespace-nowrap"
                prefetch={false}
              >
                Products
              </Link>

            </div>

            {/* Desktop CTA */}
            <Link
              href="/layouts"
              className="hidden md:block text-sm px-4 py-2 bg-black text-white rounded-lg whitespace-nowrap"
              prefetch={false}
            >
              Explore Layouts
            </Link>

          </div>

        </header>


        {/* ===== MAIN ===== */}
        <main>{children}</main>


        {/* ===== FOOTER ===== */}
        <footer className="border-t mt-20">

          <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8 text-sm text-gray-600">

            {/* Brand */}
            <div>

              <div className="font-semibold text-black mb-2 text-lg">
                MoveInReady
              </div>

              <div className="text-gray-600 leading-relaxed">
                Home Products & Move-In Solutions.
                Making your home ready for living.
              </div>

              <div className="mt-4 text-xs text-gray-400 leading-relaxed">
                Operated by SuperMilkBaba (NZ) Limited<br />
                Christchurch, New Zealand
              </div>

              <div className="mt-3 text-xs">
                Contact:{" "}
                <a
                  href=" "
                  className="underline"
                >
                  sales@moveinready.co.nz
                </a >
              </div>

            </div>


            {/* Links */}
            <div className="space-y-3">

              <div className="font-medium text-black mb-2">
                Explore MoveInReady
              </div>

              <div>
                <Link
                  href="/layouts"
                  className="hover:text-black transition"
                  prefetch={false}
                >
                  Home Layouts
                </Link>
              </div>

              <div>
                <Link
                  href="/packages"
                  className="hover:text-black transition"
                  prefetch={false}
                >
                  Complete Home Packages
                </Link>
              </div>

<div>
                <Link
                  href="/products"
                  className="hover:text-black transition"
                  prefetch={false}
                >
                  Shop Home Products
                </Link>
              </div>

              <div>
                <Link
                  href="/about"
                  className="hover:text-black transition"
                  prefetch={false}
                >
                  About MoveInReady
                </Link>
              </div>

            </div>


            {/* Email Capture */}
            <div>

              <div className="font-medium text-black mb-2">
                Stay Connected
              </div>

              <div className="text-xs text-gray-400 mb-2">
                Get updates on home solutions, new products and offers.
              </div>

              <EmailCapture source="footer" />

            </div>

          </div>

          <div className="border-t py-4 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} MoveInReady. All rights reserved.
          </div>

        </footer>

      </body>
    </html>
  )
}