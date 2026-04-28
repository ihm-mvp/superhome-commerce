import "./globals.css"
import Link from "next/link"

export const metadata = {
  title: "SuperHome",
  description: "Real Homes. Move in Ready.",
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
            <Link href="/" className="font-semibold text-lg">
              SuperHome
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
              Get Package
            </Link>

          </div>
        </header>

        {/* ===== MAIN ===== */}
        <main>
          {children}
        </main>

        {/* ===== FOOTER ===== */}
        <footer className="border-t mt-20">

          <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8 text-sm text-gray-600">

            {/* Brand */}
            <div>
              <div className="font-semibold text-black mb-2">
                SuperHome
              </div>
              <div>
                Real homes. Fully furnished. Move in ready.
              </div>
            </div>

            {/* Links */}
            <div className="space-y-2">
              <div>
                <Link href="/layouts">Layouts</Link>
              </div>
              <div>
                <Link href="/packages">Packages</Link>
              </div>
              <div>
                <Link href="/products">Products</Link>
              </div>
            </div>

            {/* Future Email Capture */}
            <div>
              <div className="font-medium mb-2">
                Stay Updated
              </div>

              <div className="flex gap-2">
                <input
                  placeholder="Email"
                  className="border px-3 py-2 rounded w-full text-sm"
                />
                <button className="bg-black text-white px-4 rounded text-sm">
                  Join
                </button>
              </div>
            </div>

          </div>

        </footer>

      </body>
    </html>
  )
}