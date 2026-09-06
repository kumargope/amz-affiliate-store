import { prisma } from '@/lib/prisma'

interface GeneratedProduct {
  title: string
  slug: string
  categorySlug: string
  price: number
  originalPrice: number
  rating: number
  reviewCount: number
  imageUrl: string
  shortDescription: string
  description: string
  features: string[]
  pros: string[]
  cons: string[]
  isFeatured: boolean
  isDeal: boolean
}

// Category image map for high quality Unsplash product photos
const CATEGORY_IMAGE_MAP: Record<string, string[]> = {
  electronics: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800',
    'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800',
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800',
  ],
  'tech-gadgets': [
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800',
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800',
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800',
    'https://images.unsplash.com/photo-1609592424089-94073e573c0f?w=800',
  ],
  'home-kitchen': [
    'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800',
    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800',
    'https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=800',
    'https://images.unsplash.com/photo-1558002038-1055907df827?w=800',
  ],
  beauty: [
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800',
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800',
    'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=800',
    'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800',
  ],
  fitness: [
    'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800',
    'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800',
    'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800',
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800',
  ],
  fashion: [
    'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800',
    'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800',
    'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
  ],
  'toys-games': [
    'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=800',
    'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800',
    'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800',
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800',
  ],
  'pet-supplies': [
    'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800',
    'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800',
    'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800',
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800',
  ],
}

function detectCategorySlug(query: string): string {
  const q = query.toLowerCase()
  if (/\b(phone|laptop|watch|tv|headphone|earphone|speaker|camera|ssd|keyboard|mouse|ps5|xbox|gaming|charger|cable|monitor|ipad|tablet|drone|mic|audio)\b/.test(q)) {
    return 'electronics'
  }
  if (/\b(coffee|fryer|blender|pot|cooker|vacuum|roomba|mug|pan|oven|knife|container|table|desk|chair|light|lamp|kitchen|home)\b/.test(q)) {
    return 'home-kitchen'
  }
  if (/\b(serum|cream|shampoo|brush|hair|face|skin|tooth|whitening|makeup|lotion|oil|perfume|cologne|razor|shaver|beauty)\b/.test(q)) {
    return 'beauty'
  }
  if (/\b(shoe|sneaker|shirt|pant|jean|jacket|hoodie|wallet|bag|backpack|dress|glass|sunglass|hat|cap|watch|apparel|fashion)\b/.test(q)) {
    return 'fashion'
  }
  if (/\b(gym|mat|dumbbell|weight|bottle|tumbler|tracker|band|fitbit|tent|bike|muscle|massage|sport|outdoor|fitness)\b/.test(q)) {
    return 'fitness'
  }
  if (/\b(lego|toy|game|puzzle|card|board|doll|figure)\b/.test(q)) {
    return 'toys-games'
  }
  if (/\b(cat|dog|pet|fountain|leash|collar|harness|food|treat|litter)\b/.test(q)) {
    return 'pet-supplies'
  }
  return 'tech-gadgets'
}

function capitalizeWords(str: string): string {
  return str
    .split(' ')
    .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : ''))
    .join(' ')
}

export async function ensureSearchProducts(query: string) {
  const trimmedQuery = query.trim()
  if (!trimmedQuery || trimmedQuery.length < 2) return 0

  try {
    // 1. Ensure Categories exist in DB
    let categories = await prisma.category.findMany()
    if (categories.length === 0) {
      const defaultCategories = [
        { name: 'Electronics', slug: 'electronics', description: 'Headphones, speakers, smart home & devices', icon: 'Laptop', order: 1 },
        { name: 'Home & Kitchen', slug: 'home-kitchen', description: 'Kitchenware, decor, cookware & organization', icon: 'Home', order: 2 },
        { name: 'Beauty & Personal Care', slug: 'beauty', description: 'Skincare, grooming, hair care & wellness', icon: 'Sparkles', order: 3 },
        { name: 'Fashion & Apparel', slug: 'fashion', description: 'Clothing, shoes, jewelry & accessories', icon: 'Shirt', order: 4 },
        { name: 'Fitness & Sports', slug: 'fitness', description: 'Workout gear, yoga, outdoors & athletic wear', icon: 'Dumbbell', order: 5 },
        { name: 'Tech Gadgets', slug: 'tech-gadgets', description: 'Cool gadgets, accessories & innovations', icon: 'Laptop', order: 6 },
        { name: 'Toys & Games', slug: 'toys-games', description: 'Fun board games, action toys & puzzles', icon: 'Gamepad2', order: 7 },
        { name: 'Pet Supplies', slug: 'pet-supplies', description: 'Pet bowls, fountains, harnesses & accessories', icon: 'Dog', order: 8 },
      ]

      for (const cat of defaultCategories) {
        await prisma.category.upsert({
          where: { slug: cat.slug },
          update: {},
          create: cat,
        })
      }
      categories = await prisma.category.findMany()
    }

    const categoryMap: Record<string, string> = {}
    categories.forEach((cat) => {
      categoryMap[cat.slug] = cat.id
    })

    // 2. Check existing matching products in DB
    const existingCount = await prisma.product.count({
      where: {
        isActive: true,
        OR: [
          { title: { contains: trimmedQuery } },
          { description: { contains: trimmedQuery } },
          { shortDescription: { contains: trimmedQuery } },
        ],
      },
    })

    // If we already have 4 or more products for this query, no need to auto-generate
    if (existingCount >= 4) return 0

    // 3. Generate 4 Brand New USA Amazon Best Seller products for this search query
    const targetCatSlug = detectCategorySlug(trimmedQuery)
    const categoryId = categoryMap[targetCatSlug] || categories[0]?.id
    const imageList = CATEGORY_IMAGE_MAP[targetCatSlug] || CATEGORY_IMAGE_MAP['electronics']
    const cleanQueryTitle = capitalizeWords(trimmedQuery)

    const productTemplates = [
      {
        titleSuffix: 'Pro Series Ultra Performance Edition',
        price: 129.99,
        origPrice: 159.99,
        rating: 4.8,
        reviews: 24200,
        feature: 'Heavy Duty Pro Grade Construction',
      },
      {
        titleSuffix: 'Compact Ergonomic Everyday Choice',
        price: 49.95,
        origPrice: 69.95,
        rating: 4.7,
        reviews: 18500,
        feature: 'Smart Space-Saving Design',
      },
      {
        titleSuffix: 'Wireless Smart Connectivity Model',
        price: 89.00,
        origPrice: 119.00,
        rating: 4.6,
        reviews: 31400,
        feature: 'Instant One-Touch Smart Controls',
      },
      {
        titleSuffix: 'Premium High-Efficiency Top Rated USA Find',
        price: 199.99,
        origPrice: 249.99,
        rating: 4.9,
        reviews: 42100,
        feature: 'Built with Premium Aircraft-Grade Materials',
      },
    ]

    let addedCount = 0
    const timeHash = Date.now().toString(36)

    for (let i = 0; i < productTemplates.length; i++) {
      const tpl = productTemplates[i]
      const uniqueSalt = Math.random().toString(36).substring(2, 6)
      const fullTitle = `${cleanQueryTitle} - ${tpl.titleSuffix}`
      const slug = `${trimmedQuery.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${i + 1}-${timeHash}-${uniqueSalt}`
      const asin = `B0USA${timeHash.toUpperCase()}${i + 1}${uniqueSalt.toUpperCase()}`
      const affiliateUrl = `https://www.amazon.com/dp/${asin}?tag=amzfinds063-20`
      const imageUrl = imageList[i % imageList.length]

      try {
        await prisma.product.create({
          data: {
            title: fullTitle,
            slug,
            categoryId,
            amazonAffiliateUrl: affiliateUrl,
            imageUrl,
            price: tpl.price,
            originalPrice: tpl.origPrice,
            rating: tpl.rating,
            reviewCount: tpl.reviews + i * 250,
            shortDescription: `Top-rated USA ${cleanQueryTitle} verified for high performance, outstanding user reviews, and fast Amazon shipping.`,
            description: `Discover the ${fullTitle}. Engineered with high quality materials, excellent user feedback, and top customer satisfaction on Amazon USA. Perfect for everyday use with long-lasting durability.`,
            features: JSON.stringify([
              tpl.feature,
              'Amazon USA Top Choice Recommendation',
              'Fast Prime USA Shipping',
              '100% Quality & Satisfaction Guaranteed',
            ]),
            pros: JSON.stringify([
              'Exceptional build quality & performance',
              'High customer satisfaction score',
              'Unbeatable value for money',
            ]),
            cons: JSON.stringify(['High demand item with limited stock']),
            isFeatured: i % 2 === 0,
            isDeal: true,
            isActive: true,
            seoTitle: `${fullTitle} - Amazon Review & Deals`,
            seoDescription: `Buy ${fullTitle} on Amazon USA with fast shipping and verified customer reviews.`,
          },
        })
        addedCount++
      } catch (err: any) {
        console.warn(`Failed to auto-generate search product for ${trimmedQuery}:`, err?.message)
      }
    }

    return addedCount
  } catch (error) {
    console.error('Error in ensureSearchProducts:', error)
    return 0
  }
}
