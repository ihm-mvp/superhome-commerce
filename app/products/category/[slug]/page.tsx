
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { notFound } from "next/navigation"

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

const PAGE_SIZE = 24

// ===== SEO Metadata =====
export async function generateMetadata({ params }: Props) {

  const { slug } = await params

  const { data: category } = await supabase
    .from("categories")
    .select("display_name, slug")
    .eq("slug", slug)
    .single()

  if (!category) {
    return {
      title: "Home Products | MoveInReady",
    }
  }

  const title = `${category.display_name} | Home Products NZ | MoveInReady`

  const description =
    `Explore ${category.display_name.toLowerCase()} products at MoveInReady. Discover practical home products selected for comfortable and convenient everyday living in New Zealand.`

  return {
    title,
    description,

    keywords: [
      `${category.display_name} NZ`,
      `${category.display_name} products`,
      `${category.display_name} home products`,
      "home products NZ",
      "MoveInReady",
      "New Zealand home products",
    ],

    openGraph: {
      title,
      description,
      images: [
        "/images/hero-image.jpg",
      ],
    },
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: Props) {

  const { slug } = await params
  const { page } = await searchParams

  // ===== Find Category =====
  const { data: category } = await supabase
    .from("categories")
    .select("id, display_name, slug")
    .eq("slug", slug)
    .single()

  if (!category) {
    return notFound()
  }

  // ===== Load All Products in Category =====
  const { data: products, error } = await supabase
    .from("products")
    .select(`
      id,
      sku_code,
      display_name_en,
      level,
      image_url
    `)
    .eq("category_id", category.id)

  if (error) {
    throw new Error("Unable to load category products.")
  }

  // ===== Sort Products =====
  const sortedProducts = [...(products || [])].sort(
    (a: any, b: any) => {

      const levelA = Number(
        a.level?.replace("L", "") || 99
      )

      const levelB = Number(
        b.level?.replace("L", "") || 99
      )

      if (levelA !== levelB) {
        return levelA - levelB
      }

      return (a.sku_code || "").localeCompare(
        b.sku_code || ""
      )
    }
  )

  // ===== Pagination =====
  const totalProducts = sortedProducts.length
  const totalPages = Math.ceil(totalProducts / PAGE_SIZE)

  const requestedPage = Math.max(
    1,
    Number.parseInt(page || "1", 10) || 1
  )

  const currentPage = Math.min(
    requestedPage,
    Math.max(totalPages, 1)
  )

  const startIndex = (currentPage - 1) * PAGE_SIZE

  const currentProducts = sortedProducts.slice(
    startIndex,
    startIndex + PAGE_SIZE
  )

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">

      {/* ===== Breadcrumb ===== */}
      <div className="flex items-center gap-2 text-sm text-gray-400">

        <Link
          href="/products"
          className="hover:text-black transition"
          prefetch={false}
        >
          Products
        </Link>

        <span>/</span>

        <span className="text-gray-700">
          {category.display_name}
        </span>

      </div>

      {/* ===== Header ===== */}
      <div className="space-y-3">

        <h1 className="text-3xl font-semibold">
          {category.display_name}
        </h1>

        <p className="text-gray-500 max-w-3xl leading-relaxed">
          Explore our {category.display_name.toLowerCase()}
          collection. Discover products selected to make
          your home more comfortable, functional and
          enjoyable.
        </p >

        <div className="text-sm text-gray-400 pt-1">
          {totalProducts} products
        </div>

      </div>

      {/* ===== Product Grid ===== */}
      {currentProducts.length > 0 ? (

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">

          {currentProducts.map((p: any) => (

            <Link
              key={p.id}
              href={`/products/${p.id}`}
              className="group block bg-white border rounded-xl overflow-hidden hover:shadow-md transition"
              prefetch={false}
            >

              <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">

                {p.image_url && (
                  <img
                    src={p.image_url}
                    alt={p.display_name_en || p.sku_code}
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition duration-300"
                    loading="lazy"
                  />
                )}

              </div>

 <div className="p-3">

                <div className="text-sm font-medium line-clamp-2">
                  {p.display_name_en || p.sku_code}
                </div>

              </div>

            </Link>

          ))}

        </div>

      ) : (

        <div className="py-16 text-center text-gray-400">
          No products available in this category yet.
        </div>

      )}

      {/* ===== Pagination ===== */}
      {totalPages > 1 && (

        <div className="flex flex-wrap justify-center items-center gap-2 pt-4">

          {currentPage > 1 && (
            <Link
              href={`/products/category/${slug}?page=${currentPage - 1}`}
              className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
              prefetch={false}
            >
              Previous
            </Link>
          )}

          {Array.from(
            { length: totalPages },
            (_, i) => i + 1
          ).map((pageNumber) => (

            <Link
              key={pageNumber}
              href={
                pageNumber === 1
                  ? `/products/category/${slug}`
                  : `/products/category/${slug}?page=${pageNumber}`
              }
              className={`px-4 py-2 border rounded-lg text-sm ${
                pageNumber === currentPage
                  ? "bg-black text-white border-black"
                  : "hover:bg-gray-50"
              }`}
              prefetch={false}
            >
              {pageNumber}
            </Link>

          ))}

          {currentPage < totalPages && (
            <Link
              href={`/products/category/${slug}?page=${currentPage + 1}`}
              className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
              prefetch={false}
            >
              Next
            </Link>
          )}

        </div>

      )}

      {/* ===== SEO Content ===== */}
      <div className="border-t pt-10">

        <div className="max-w-4xl space-y-4 text-gray-600 leading-relaxed">

          <h2 className="text-2xl font-semibold text-black">
            {category.display_name} for Better Everyday Living
          </h2>

          <p>
            Explore the MoveInReady {category.display_name.toLowerCase()}
            collection, with products selected to support
            comfortable, practical and enjoyable modern living.
          </p >

          <p>
            From preparing a new home to improving your
            existing living environment, MoveInReady makes
            it easier to discover products that suit your
            everyday needs.
          </p >

        </div>

      </div>

    </div>
  )
}