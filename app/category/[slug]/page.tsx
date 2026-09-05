import React from 'react'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/ProductCard'
import { Tag, ArrowLeft } from 'lucide-react'

interface CategoryPageProps {
  params: {
    slug: string
  }
  searchParams: {
    sort?: string
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
  })

  if (!category) return { title: 'Category Not Found' }

  const title = `Best ${category.name} Products & Deals | AmzFinds`
  const description = category.description || `Browse top-rated Amazon products in ${category.name}. Hand-picked affiliate recommendations.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
  })

  if (!category) notFound()

  let orderBy: any = { updatedAt: 'desc' }
  if (searchParams.sort === 'price-asc') orderBy = { price: 'asc' }
  if (searchParams.sort === 'price-desc') orderBy = { price: 'desc' }
  if (searchParams.sort === 'rating') orderBy = { rating: 'desc' }

  const products = await prisma.product.findMany({
    where: { categoryId: category.id, isActive: true },
    orderBy,
    include: { category: { select: { name: true, slug: true } } },
  })

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-amber-600 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">{category.name}</span>
        </div>

        {/* Category Header Banner */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full mb-2">
                <Tag className="w-3.5 h-3.5" />
                <span>Category Showcase</span>
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">{category.name}</h1>
              {category.description && (
                <p className="text-slate-600 text-sm mt-1">{category.description}</p>
              )}
            </div>

            {/* Sorting Controls */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Sort by:</span>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <Link
                  href={`/category/${category.slug}`}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                    !searchParams.sort ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Newest
                </Link>
                <Link
                  href={`/category/${category.slug}?sort=rating`}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                    searchParams.sort === 'rating' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Top Rated
                </Link>
                <Link
                  href={`/category/${category.slug}?sort=price-asc`}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                    searchParams.sort === 'price-asc' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Price: Low to High
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-2">No products found in {category.name}</h3>
            <p className="text-slate-500 text-xs mb-6">Check back soon as our admin curates more finds.</p>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl"
            >
              Return Home
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
