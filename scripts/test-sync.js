const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function testAutoSync() {
  console.log('🧪 Starting live test of Auto-Import USA Best Sellers logic...')

  // 1. Ensure categories
  let categories = await prisma.category.findMany()
  console.log(`📂 Categories in DB: ${categories.length}`)

  // 2. Fetch products count before
  const countBefore = await prisma.product.count()
  console.log(`📦 Product count before sync: ${countBefore}`)

  // 3. Test multi-category import logic
  const MULTI_CATEGORY_MASTER_LIBRARY = [
    {
      title: 'Bose QuietComfort Ultra Wireless Noise Cancelling Headphones',
      slug: 'bose-quietcomfort-ultra-wireless-headphones-test',
      categorySlug: 'electronics',
      amazonAffiliateUrl: 'https://www.amazon.com/dp/B0CCZ26B5VTEST?tag=amzfinds063-20',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
      price: 379.00,
      originalPrice: 429.00,
      rating: 4.6,
      reviewCount: 14200,
      shortDescription: 'World-class noise cancellation, spatial audio, and luxury comfort.',
      description: 'Bose QuietComfort Ultra Headphones feature breakthrough spatialized audio.',
      features: JSON.stringify(['Spatialized Audio', 'World-Class ANC', '24 Hour Battery Life']),
      pros: JSON.stringify(['Top tier spatial audio', 'Luxurious ear cushions']),
      cons: JSON.stringify(['Non-foldable carrying case']),
      isFeatured: true,
      isDeal: true,
    },
    {
      title: 'JBL Charge 5 Portable Waterproof Speaker with Powerbank',
      slug: 'jbl-charge-5-portable-waterproof-speaker-test',
      categorySlug: 'electronics',
      amazonAffiliateUrl: 'https://www.amazon.com/dp/B08YFGKB9JTEST?tag=amzfinds063-20',
      imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800',
      price: 149.95,
      originalPrice: 179.95,
      rating: 4.8,
      reviewCount: 31200,
      shortDescription: 'Bold JBL Original Pro Sound with 20 hours playtime and built-in power bank.',
      description: 'Take the party with you no matter what the weather.',
      features: JSON.stringify(['IP67 Waterproof and Dustproof', '20 Hours Playtime']),
      pros: JSON.stringify(['Deep punchy bass response', 'Built-in battery bank']),
      cons: JSON.stringify(['Slightly heavier than Flip 6']),
      isFeatured: true,
      isDeal: true,
    },
    {
      title: 'Ninja AF101 Air Fryer 4-in-1 4-Quart Capacity',
      slug: 'ninja-af101-air-fryer-4qt-capacity-test',
      categorySlug: 'home-kitchen',
      amazonAffiliateUrl: 'https://www.amazon.com/dp/B07FDJMC9QTEST?tag=amzfinds063-20',
      imageUrl: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800',
      price: 89.99,
      originalPrice: 129.99,
      rating: 4.8,
      reviewCount: 68500,
      shortDescription: 'Air fry with up to 75% less fat than traditional frying methods.',
      description: 'Wide temperature range from 105 to 400°F allows you to gently remove moisture.',
      features: JSON.stringify(['4-Quart Capacity', '4-in-1 Versatility']),
      pros: JSON.stringify(['Ultra crispy results', 'Super fast preheat time']),
      cons: JSON.stringify(['Takes counter space']),
      isFeatured: true,
      isDeal: true,
    },
    {
      title: 'Keurig K-Mini Single Serve K-Cup Pod Coffee Maker',
      slug: 'keurig-k-mini-single-serve-coffee-maker-red-test',
      categorySlug: 'home-kitchen',
      amazonAffiliateUrl: 'https://www.amazon.com/dp/B07DVZ2M1RTEST?tag=amzfinds063-20',
      imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800',
      price: 79.99,
      originalPrice: 99.99,
      rating: 4.6,
      reviewCount: 96400,
      shortDescription: 'Less than 5 inches wide, perfect for small spaces and fresh single-cup brewing.',
      description: 'Brews coffee, tea, hot cocoa, specialty, and iced beverages.',
      features: JSON.stringify(['Compact 5" Wide Design', 'Brews 6 to 12 oz']),
      pros: JSON.stringify(['Fits any kitchen or desk counter', 'Fast 2-minute brew time']),
      cons: JSON.stringify(['Single cup water reservoir only']),
      isFeatured: false,
      isDeal: true,
    },
    {
      title: 'COSRX Snail Mucin 96% Power Repairing Essence Serum',
      slug: 'cosrx-snail-mucin-96-power-repairing-essence-test',
      categorySlug: 'beauty',
      amazonAffiliateUrl: 'https://www.amazon.com/dp/B00PBX3L7KTEST?tag=amzfinds063-20',
      imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800',
      price: 14.99,
      originalPrice: 25.00,
      rating: 4.7,
      reviewCount: 91200,
      shortDescription: 'Formulated with 96.3% Snail Secretion Filtrate to repair and revitalize skin.',
      description: 'Formulated with 96.3% Snail Secretion Filtrate to repair and revitalize skin.',
      features: JSON.stringify(['96.3% Snail Secretion Filtrate', 'Deep Hydration & Repair']),
      pros: JSON.stringify(['Gives instant glass-skin glow', 'Super lightweight formula']),
      cons: JSON.stringify(['Slimy texture initial application']),
      isFeatured: false,
      isDeal: true,
    },
  ]

  const categoryMap = {}
  categories.forEach((cat) => {
    categoryMap[cat.slug] = cat.id
  })

  let added = 0
  for (const item of MULTI_CATEGORY_MASTER_LIBRARY) {
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
        features: item.features,
        pros: item.pros,
        cons: item.cons,
        isFeatured: item.isFeatured,
        isDeal: item.isDeal,
        isActive: true,
        seoTitle: `${item.title} - Amazon Review`,
        seoDescription: item.shortDescription,
      },
    })
    added++
  }

  const countAfter = await prisma.product.count()
  console.log(`✅ Successfully added ${added} items!`)
  console.log(`📦 Product count after sync: ${countAfter}`)
}

testAutoSync()
  .catch((err) => {
    console.error('❌ Test failed with error:', err)
  })
  .finally(() => prisma.$disconnect())
