import React from 'react'
import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'
import { Search as SearchIcon, Filter, SlidersHorizontal } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Search Amazon Products | AmzFinds',
  description: 'Search through curated Amazon product recommendations.',
}

interface SearchPageProps {
  searchParams: {
    q?: string
    category?: string
    sort?: string
    featured?: string
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || ''
  const categorySlug = searchParams.category || ''
  const sort = searchParams.sort || 'newest'
  const featuredOnly = searchParams.featured === 'true'

  let categories: any[] = []
  let products: any[] = []

  try {
    // Fetch categories for filter dropdown
    categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true, slug: true },
    })

    // Build filter conditions
    const where: any = {
      isActive: true,
    }

    if (query) {
      where.OR = [
        { title: { contains: query } },
        { description: { contains: query } },
        { shortDescription: { contains: query } },
      ]
    }

    if (categorySlug) {
      const selectedCat = categories.find((c) => c.slug === categorySlug)
      if (selectedCat) {
        where.categoryId = selectedCat.id
      }
    }

    if (featuredOnly) {
      where.isFeatured = true
    }

    // Build sorting condition
    let orderBy: any = { updatedAt: 'desc' }
    if (sort === 'popular') orderBy = [{ rating: 'desc' }, { updatedAt: 'desc' }]
    if (sort === 'price-asc') orderBy = { price: 'asc' }
    if (sort === 'price-desc') orderBy = { price: 'desc' }
    if (sort === 'rating') orderBy = { rating: 'desc' }

    products = await prisma.product.findMany({
      where,
      orderBy,
      include: { category: { select: { name: true, slug: true } } },
    })
  } catch (error) {
    console.error('Error fetching search page products:', error)
  }

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-6">
            {query ? `Search results for "${query}"` : 'Browse Product Storefront'}
          </h1>

          {/* Search Form */}
          <form action="/search" method="GET" className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Search products by title, feature, or keyword..."
                className="w-full pl-11 pr-4 py-3 bg-slate-100/80 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
              <SearchIcon className="w-5 h-5 text-slate-400 absolute left-4 top-3.5 pointer-events-none" />
            </div>

            <select
              name="category"
              defaultValue={categorySlug}
              className="px-4 py-3 bg-slate-100/80 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select
              name="sort"
              defaultValue={sort}
              className="px-4 py-3 bg-slate-100/80 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="newest">Newest First</option>
              <option value="popular">Most Popular</option>
              <option value="rating">Top Rated</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
            </select>

            <button
              type="submit"
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-2xl text-sm shadow-md transition-colors"
            >
              Apply Filter
            </button>
          </form>

          {/* Quick Active Filter Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-1 text-slate-400">
              <Filter className="w-3.5 h-3.5" />
              Showing {products.length} items
            </span>
            {query && (
              <span className="bg-amber-100 text-amber-900 px-2.5 py-1 rounded-lg">
                Query: {query}
              </span>
            )}
            {categorySlug && (
              <span className="bg-amber-100 text-amber-900 px-2.5 py-1 rounded-lg">
                Category: {categories.find((c) => c.slug === categorySlug)?.name || categorySlug}
              </span>
            )}
          </div>
        </div>

        {/* Results Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-2">No matching products found</h3>
            <p className="text-slate-500 text-xs mb-6">Try searching with a broader keyword or resetting filters.</p>
            <Link
              href="/search"
              className="inline-flex items-center justify-center px-6 py-2.5 bg-amber-500 text-slate-950 text-xs font-bold rounded-xl"
            >
              Reset All Filters
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
