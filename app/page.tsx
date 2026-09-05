import React from 'react'
import Link from 'next/link'
import Hero from '@/components/Hero'
import CategoryGrid from '@/components/CategoryGrid'
import ProductCard from '@/components/ProductCard'
import WhyShopUs from '@/components/WhyShopUs'
import LuckyDealSpinner from '@/components/LuckyDealSpinner'
import { prisma } from '@/lib/prisma'
import { Flame, Sparkles, ArrowRight, Gift, Trophy } from 'lucide-react'

export const revalidate = 60 // Revalidate every minute

export default async function HomePage() {
  let categories: any[] = []
  let trendingProducts: any[] = []
  let popularProducts: any[] = []

  try {
    categories = await prisma.category.findMany({
      take: 10,
      orderBy: { order: 'asc' },
      include: { _count: { select: { products: true } } },
    })

    trendingProducts = await prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      take: 6,
      include: { category: { select: { name: true, slug: true } } },
      orderBy: { updatedAt: 'desc' },
    })

    popularProducts = await prisma.product.findMany({
      where: { isActive: true },
      take: 8,
      include: { category: { select: { name: true, slug: true } } },
      orderBy: [{ rating: 'desc' }, { updatedAt: 'desc' }],
    })

    var allProducts = await prisma.product.findMany({
      where: { isActive: true },
      include: { category: { select: { name: true, slug: true } } },
      orderBy: { createdAt: 'desc' },
    })
  } catch (e) {
    console.error('Database fetch error on HomePage:', e)
  }

  return (
    <div>
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Interactive Gift Finder Banner Teaser */}
      <section className="bg-amber-500 text-slate-950 py-8 px-4 border-b border-amber-600">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center font-black shrink-0">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-black text-xl tracking-tight">Need a USA Gift Recommendation?</h2>
              <p className="text-xs text-slate-900 font-medium">
                Try our 30-Second Interactive Gift Finder & Share Wishlists on WhatsApp, iMessage or Pinterest!
              </p>
            </div>
          </div>

          <Link
            href="/gift-finder"
            className="px-6 py-3 bg-slate-950 hover:bg-slate-800 text-amber-400 font-bold rounded-2xl text-xs tracking-wider uppercase transition-colors shrink-0 shadow-lg"
          >
            Launch Gift Finder 🎁
          </Link>
        </div>
      </section>

      {/* 3. Featured Categories Grid */}
      <CategoryGrid categories={categories} />

      {/* 4. Gamified Lucky Deal Spinner Wheel */}
      {popularProducts.length > 0 && <LuckyDealSpinner products={popularProducts} />}

      {/* 5. Trending / Featured Products Section */}
      {trendingProducts.length > 0 && (
        <section className="py-16 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-100/80 px-2.5 py-1 rounded-full mb-2">
                  <Flame className="w-3.5 h-3.5 fill-amber-600" />
                  <span>Hand-Picked Highlights</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Trending Products
                </h2>
              </div>
              <Link
                href="/search?sort=popular"
                className="inline-flex items-center gap-1 text-sm font-bold text-amber-600 hover:text-amber-700"
              >
                <span>View All Trending</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. Full Storefront Showcase Section - Display ALL Products */}
      {allProducts.length > 0 && (
        <section className="py-16 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full mb-2">
                  <Trophy className="w-3.5 h-3.5 text-emerald-700" />
                  <span>All Storefront Products ({allProducts.length})</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Explore All Amazon USA Finds
                </h2>
              </div>
              <Link
                href="/search"
                className="inline-flex items-center gap-1 text-sm font-bold text-amber-600 hover:text-amber-700"
              >
                <span>Search & Filter</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. Why Shop Through Us Section */}
      <WhyShopUs />
    </div>
  )
}
