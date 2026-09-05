import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminFromCookie } from '@/lib/auth'

const USA_BESTSELLERS_CATALOG = [
  {
    title: 'Apple AirPods Pro (2nd Generation) Wireless Earbuds',
    slug: 'apple-airpods-pro-2nd-gen',
    categorySlug: 'electronics',
    amazonAffiliateUrl: 'https://www.amazon.com/dp/B0BDHWDR12?tag=amzfinds063-20',
    imageUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800',
    price: 249.00,
    originalPrice: 299.00,
    rating: 4.7,
    reviewCount: 28900,
    shortDescription: 'Next-level Active Noise Cancellation, Adaptive Audio, and personalized Spatial Audio.',
    description: 'Up to 2x more Active Noise Cancellation than the previous generation. Transparency mode allows you to comfortably hear the world around you. All-new Adaptive Audio intelligently tailors noise control to your environment.',
    features: ['Active Noise Cancellation', 'Adaptive Audio', 'MagSafe Charging Case (USB-C)', 'Up to 6 hours listening time'],
    pros: ['Industry leading noise cancellation', 'Great sound quality and Spatial Audio', 'Seamless Apple ecosystem setup'],
    cons: ['High price tag', 'Only fits well with correct ear tips'],
    isFeatured: true,
    isDeal: true,
  },
  {
    title: 'Ninja AF101 Air Fryer, 4 Qt Capacity',
    slug: 'ninja-af101-air-fryer-4qt',
    categorySlug: 'home-kitchen',
    amazonAffiliateUrl: 'https://www.amazon.com/dp/B07FDJMC9Q?tag=amzfinds063-20',
    imageUrl: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800',
    price: 89.99,
    originalPrice: 129.99,
    rating: 4.8,
    reviewCount: 65400,
    shortDescription: 'Air fry with up to 75 percent less fat than traditional frying methods.',
    description: 'Wide temperature range from 105 to 400 degrees Fahrenheit allows you to gently remove moisture from foods or quickly cook and crisp foods with convection heat. 4-quart ceramic-coated nonstick basket and crisper plate fit up to 2 lbs of French fries.',
    features: ['4 Quart Capacity', '4-in-1 Versatility (Air Fry, Roast, Reheat, Dehydrate)', 'Dishwasher Safe Parts'],
    pros: ['Crispy results with minimal oil', 'Super easy to clean', 'Fast preheat time'],
    cons: ['Takes up counter space', 'Slight plastic smell on first use'],
    isFeatured: true,
    isDeal: true,
  },
  {
    title: 'CeraVe Hydrating Facial Cleanser for Normal to Dry Skin',
    slug: 'cerave-hydrating-facial-cleanser',
    categorySlug: 'beauty',
    amazonAffiliateUrl: 'https://www.amazon.com/dp/B01MSSDEPK?tag=amzfinds063-20',
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800',
    price: 15.49,
    originalPrice: 18.99,
    rating: 4.7,
    reviewCount: 112000,
    shortDescription: 'Dermatologist recommended hydrating cleanser with hyaluronic acid & essential ceramides.',
    description: 'Formulated with hyaluronic acid, ceramides, and glycerin to help hydrate skin without stripping moisture. Removes makeup, dirt, and excess oil, providing 24-hour hydration and leaving a moisturized, non-greasy feel.',
    features: ['Hyaluronic Acid & 3 Essential Ceramides', 'Fragrance-Free & Non-Comedogenic', 'MVE Technology for 24h Hydration'],
    pros: ['Gentle on sensitive skin', 'Dermatologist recommended', 'Great value size'],
    cons: ['Non-foaming texture', 'Not ideal for heavy waterproof makeup removal alone'],
    isFeatured: false,
    isDeal: false,
  },
  {
    title: 'Stanley Quencher H2.0 FlowState Stainless Steel Tumbler 40oz',
    slug: 'stanley-quencher-h20-tumbler-40oz',
    categorySlug: 'fitness',
    amazonAffiliateUrl: 'https://www.amazon.com/dp/B0BL5DMNLN?tag=amzfinds063-20',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800',
    price: 45.00,
    originalPrice: 50.00,
    rating: 4.7,
    reviewCount: 42300,
    shortDescription: 'Vacuum insulated tumbler with lid and straw for cold water hydration all day.',
    description: 'Constructed of 90% recycled BPA-free 18/8 stainless steel. Keeps drinks iced for up to 2 days or cold for 11 hours. Ergonomic handle includes comfort-grip inserts for easy carrying, and narrow base fits almost any car cup holder.',
    features: ['40oz Capacity', 'Keeps cold for 11 hours / iced for 2 days', 'Car Cup Holder Compatible', 'Dishwasher Safe'],
    pros: ['Keeps ice frozen for 48 hours', 'Comfortable handle', 'Fits standard car cup holders'],
    cons: ['Can spill if turned upside down', 'Heavy when fully filled'],
    isFeatured: true,
    isDeal: false,
  },
  {
    title: 'Anker Magnetic Portable Charger Wireless Power Bank 5,000mAh',
    slug: 'anker-magnetic-portable-charger-5k',
    categorySlug: 'tech-gadgets',
    amazonAffiliateUrl: 'https://www.amazon.com/dp/B099F558MC?tag=amzfinds063-20',
    imageUrl: 'https://images.unsplash.com/photo-1609592424089-94073e573c0f?w=800',
    price: 39.99,
    originalPrice: 49.99,
    rating: 4.5,
    reviewCount: 19800,
    shortDescription: 'Snap-and-charge wireless power bank with built-in foldable stand for iPhone MagSafe.',
    description: 'Snaps magnetically into place to ensure perfect alignment and an efficient charge. Features a versatile built-in foldable kickstand that keeps your iPhone upright for a comfortable viewing angle.',
    features: ['MagSafe Compatible', 'Built-in Foldable Stand', 'Compact 5000mAh Battery'],
    pros: ['Strong magnetic hold', 'Convenient kickstand', 'Ultra portable size'],
    cons: ['Charges at 7.5W wireless speed', 'Only 1 full charge for larger phones'],
    isFeatured: false,
    isDeal: true,
  },
]

export async function POST(req: Request) {
  const admin = await getAdminFromCookie()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let addedCount = 0
  let skippedCount = 0

  try {
    const categories = await prisma.category.findMany()
    const categoryMap: Record<string, string> = {}
    categories.forEach((cat) => {
      categoryMap[cat.slug] = cat.id
    })

    for (const item of USA_BESTSELLERS_CATALOG) {
      const existing = await prisma.product.findFirst({
        where: {
          OR: [
            { slug: item.slug },
            { amazonAffiliateUrl: item.amazonAffiliateUrl },
          ],
        },
      })

      if (existing) {
        skippedCount++
        continue
      }

      const categoryId = categoryMap[item.categorySlug] || categories[0]?.id
      if (!categoryId) continue

      await prisma.product.create({
        data: {
          title: item.title,
          slug: item.slug,
          categoryId,
          amazonAffiliateUrl: item.amazonAffiliateUrl,
          imageUrl: item.imageUrl,
          price: item.price,
          originalPrice: item.originalPrice,
          rating: item.rating,
          reviewCount: item.reviewCount,
          shortDescription: item.shortDescription,
          description: item.description,
          features: JSON.stringify(item.features),
          pros: JSON.stringify(item.pros),
          cons: JSON.stringify(item.cons),
          isFeatured: item.isFeatured,
          isDeal: item.isDeal,
          isActive: true,
        },
      })
      addedCount++
    }

    return NextResponse.json({
      success: true,
      addedCount,
      skippedCount,
      message: `Successfully imported ${addedCount} USA bestsellers. Skipped ${skippedCount} duplicate links.`,
    })
  } catch (error: any) {
    console.error('Error syncing bestsellers:', error)
    return NextResponse.json({ error: error?.message || 'Failed to sync USA bestsellers' }, { status: 500 })
  }
}
