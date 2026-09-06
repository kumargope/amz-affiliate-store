import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const revalidate = 60

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://amz-affiliate-store.vercel.app'

  let products: any[] = []
  try {
    products = await prisma.product.findMany({
      where: { isActive: true },
      include: { category: { select: { name: true, slug: true } } },
      orderBy: { updatedAt: 'desc' },
      take: 50,
    })
  } catch (e) {
    console.error('Error fetching products for social feed:', e)
  }

  const socialItems = products.map((product) => ({
    id: product.id,
    title: product.title,
    price: product.price ? `$${product.price.toFixed(2)}` : 'Check Deal',
    description: product.shortDescription || product.description,
    category: product.category?.name || 'General',
    image_url: product.imageUrl,
    url: `${baseUrl}/product/${product.slug}`,
    affiliate_url: product.amazonAffiliateUrl,
    rating: product.rating,
    pinterest_title: `${product.title} | Amazon USA Deal`,
    social_caption: `🔥 ${product.title}\n💰 Price: ${product.price ? `$${product.price.toFixed(2)}` : 'Check Amazon'}\n⭐ Rating: ${product.rating || '4.5'}/5\n👉 Check deal here: ${baseUrl}/product/${product.slug}`,
    updated_at: product.updatedAt,
  }))

  return NextResponse.json({
    status: 'success',
    total: socialItems.length,
    site_url: baseUrl,
    products: socialItems,
  })
}
