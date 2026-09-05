import React from 'react'
import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/ProductCard'
import { Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Top Amazon Deals & Discounts | AmzFinds',
  description: 'Hand-picked Amazon deals, discounts, and price drops verified by our team.',
}

export default async function DealsPage() {
  let dealProducts: any[] = []

  try {
    dealProducts = await prisma.product.findMany({
      where: { isActive: true, isDeal: true },
      include: { category: { select: { name: true, slug: true } } },
      orderBy: { updatedAt: 'desc' },
    })
  } catch (error) {
    console.error('Error fetching deals page products:', error)
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-red-600 to-amber-600 text-white p-8 sm:p-12 rounded-3xl shadow-lg mb-10 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <Zap className="w-4 h-4 fill-white" />
              <span>Verified Amazon Price Drops</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3">
              Featured Amazon Deals
            </h1>
            <p className="text-white/90 text-sm sm:text-base leading-relaxed">
              Explore hand-selected products currently offering discounts or special promotional value on Amazon.
            </p>
          </div>
        </div>

        {/* Deals Product Grid */}
        {dealProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {dealProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-2">No Active Deals Right Now</h3>
            <p className="text-slate-500 text-xs">Our team constantly monitors Amazon for verified price drops. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  )
}
