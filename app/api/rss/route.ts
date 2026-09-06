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
      take: 100,
    })
  } catch (e) {
    console.error('Error fetching products for RSS feed:', e)
  }

  const itemsXml = products
    .map((product) => {
      const productUrl = `${baseUrl}/product/${product.slug}`
      const pubDate = new Date(product.updatedAt || product.createdAt || Date.now()).toUTCString()
      const priceVal = product.price ? `${product.price.toFixed(2)} USD` : '29.99 USD'
      const imageUrl = escapeXml(product.imageUrl)
      const titleStr = escapeXml(product.title)
      const descStr = escapeXml(product.shortDescription || product.description || product.title)
      const categoryStr = escapeXml(product.category?.name || 'Deals')

      return `
    <item>
      <title>${titleStr}</title>
      <link>${productUrl}</link>
      <guid isPermaLink="true">${productUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${descStr}</description>
      <category>${categoryStr}</category>
      <enclosure url="${imageUrl}" type="image/jpeg" length="50000" />
      <media:content url="${imageUrl}" medium="image" type="image/jpeg" />
      <g:id>${escapeXml(product.id || product.slug)}</g:id>
      <g:title>${titleStr}</g:title>
      <g:description>${descStr}</g:description>
      <g:link>${productUrl}</g:link>
      <g:image_link>${imageUrl}</g:image_link>
      <g:price>${priceVal}</g:price>
      <g:availability>in stock</g:availability>
      <g:condition>new</g:condition>
      <g:brand>Amazon USA</g:brand>
    </item>`
    })
    .join('')

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>AmzFinds | Hand-Picked Amazon Deals &amp; USA Products</title>
    <link>${baseUrl}</link>
    <description>Curated Amazon product discovery storefront with daily trending USA deals, hand-picked finds, and direct discounts.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${itemsXml}
  </channel>
</rss>`

  return new NextResponse(rssXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  })
}

function escapeXml(unsafe: string): string {
  return (unsafe || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
