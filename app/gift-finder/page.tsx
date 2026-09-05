import React from 'react'
import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import GiftFinderWizard from '@/components/GiftFinderWizard'

export const metadata: Metadata = {
  title: 'US Gift Finder & Holiday Wishlist Generator | AmzFinds',
  description: 'Find top-rated Amazon US gifts for birthdays, Christmas, Black Friday, and special occasions.',
}

export default async function GiftFinderPage() {
  let products: any[] = []
  try {
    products = await prisma.product.findMany({
      where: { isActive: true },
      include: { category: { select: { name: true, slug: true } } },
      orderBy: { rating: 'desc' },
    })
  } catch (error) {
    console.error('Error fetching gift finder products:', error)
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GiftFinderWizard products={products} />
      </div>
    </div>
  )
}
