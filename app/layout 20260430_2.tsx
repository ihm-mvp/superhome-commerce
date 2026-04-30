import "./globals.css"
import Link from "next/link"
import EmailCapture from "@/components/EmailCapture" // ✅ 修复

export const metadata = {
  title: "MoveInReady",
  description:
    "Move-in ready homes in New Zealand. Fully furnished before you arrive.",
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
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

            {/* Logo */}
            <Link href="/" className="flex flex-col leading-tight">
              <span className="font-semibold text-lg">
                MoveInReady
              </span>
              <span className="text-xs text-gray-400">
                by SuperHome
              </span>
            </Link>

            {/* Nav */}
            <nav className="hidden md:flex gap-6 text-sm text-gray-600">
              <Link href="/layouts" className="hover:text-black">
                Layouts
              </Link>
              <Link href="/packages" className="hover:text-black">
                Packages
              </Link>
              <Link href="/products" className="hover:text-black">
                Products
              </Link>
            </nav>

            {/* CTA */}
            <Link
              href="/packages"
              className="text-sm px-4 py-2 bg-black text-white rounded-lg"
            >
              View Packages
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

              <div className="text-gray-600">
                Move-in ready homes, fully furnished before you arrive.
              </div>

              <div className="mt-3 text-xs text-gray-400">
                A SuperHome platform
              </div>

              <div className="mt-4 text-xs text-gray-400 leading-relaxed">
                Operated by SuperMilkBaba (NZ) Limited<br />
                Christchurch, New Zealand
              </div>

              <div className="mt-3 text-xs">
                Contact:{" "}
                <a
                  href=" " // ✅ 修复
                  className="underline"
                >
                  sales@moveinready.co.nz
                </a >
              </div>
            </div>

            {/* Links */}
            <div className="space-y-2">
              <div>
                <Link href="/layouts">Explore Layouts</Link>
              </div>
              <div>
                <Link href="/packages">Furniture Packages</Link>
              </div>
              <div>
                <Link href="/products">Browse Products</Link>
              </div>
            </div>

            {/* Email Capture */}
            <div>
              <div className="font-medium mb-2">
                Get Updates
              </div>

              <div className="text-xs text-gray-400 mb-2">
                New layouts, packages and offers
              </div>

              <EmailCapture source="footer" />
            </div>

          </div>
        </footer>

      </body>
    </html>
  )
}