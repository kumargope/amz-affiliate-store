import { prisma } from '@/lib/prisma'

const PRODUCT_KEYWORD_IMAGES: Array<{ keywords: RegExp; imageUrl: string }> = [
  { keywords: /\b(power bank|portable charger|anker 737)\b/i, imageUrl: 'https://images.unsplash.com/photo-1609592424089-94073e573c0f?w=800' },
  { keywords: /\b(airtag|tile|tracker|finder)\b/i, imageUrl: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=800' },
  { keywords: /\b(echo|dot|smart speaker)\b/i, imageUrl: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=800' },
  { keywords: /\b(plug|kasa|outlet)\b/i, imageUrl: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800' },
  { keywords: /\b(cam|camera|doorbell|ring|eufy)\b/i, imageUrl: 'https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?w=800' },
  { keywords: /\b(thermostat|nest)\b/i, imageUrl: 'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=800' },
  { keywords: /\b(bulb|light|lighting|govee|strip)\b/i, imageUrl: 'https://images.unsplash.com/photo-1550985616-10810253b84d?w=800' },
  { keywords: /\b(hub|dock|usb-c)\b/i, imageUrl: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800' },
  { keywords: /\b(mouse|mx master)\b/i, imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800' },
  { keywords: /\b(keyboard|k380)\b/i, imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800' },
  { keywords: /\b(ssd|hard drive|t7|wd elements)\b/i, imageUrl: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800' },
  { keywords: /\b(laptop stand)\b/i, imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800' },
  { keywords: /\b(stream deck|elgato)\b/i, imageUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800' },
  { keywords: /\b(mic|microphone|yeti)\b/i, imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800' },
  { keywords: /\b(headphone|airpods max|q30|wh-ch720n|ath-m20x)\b/i, imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800' },
  { keywords: /\b(earpod|earbud|airpods)\b/i, imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800' },
  { keywords: /\b(kindle|paperwhite|e-reader)\b/i, imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800' },
  { keywords: /\b(tablet|fire hd)\b/i, imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800' },
  { keywords: /\b(fire tv|roku|streaming)\b/i, imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800' },
  { keywords: /\b(charger|charging station|anker nano)\b/i, imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800' },
  { keywords: /\b(case|magsafe|spigen)\b/i, imageUrl: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800' },
  { keywords: /\b(car mount|esr)\b/i, imageUrl: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800' },
  { keywords: /\b(air fryer|cosori)\b/i, imageUrl: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800' },
  { keywords: /\b(blender|ninja foodi)\b/i, imageUrl: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800' },
  { keywords: /\b(scale|kitchen scale)\b/i, imageUrl: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800' },
  { keywords: /\b(thermometer|thermopro)\b/i, imageUrl: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800' },
  { keywords: /\b(salad spinner)\b/i, imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800' },
  { keywords: /\b(skillet|cast iron|lodge)\b/i, imageUrl: 'https://images.unsplash.com/photo-1584946929963-56c1744a8d5f?w=800' },
  { keywords: /\b(creami|ice cream)\b/i, imageUrl: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=800' },
  { keywords: /\b(frother|zulay)\b/i, imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800' },
  { keywords: /\b(sandwich maker)\b/i, imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800' },
  { keywords: /\b(pyrex|food storage|container)\b/i, imageUrl: 'https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=800' },
  { keywords: /\b(brita|pitcher|water filter)\b/i, imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=800' },
  { keywords: /\b(can opener)\b/i, imageUrl: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800' },
  { keywords: /\b(waffle maker|dash mini)\b/i, imageUrl: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=800' },
  { keywords: /\b(toaster oven)\b/i, imageUrl: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800' },
  { keywords: /\b(tumbler|simple modern)\b/i, imageUrl: 'https://images.unsplash.com/photo-1577741314755-048d8525d31e?w=800' },
  { keywords: /\b(water bottle|hydro flask|owala|stanley|yeti rambler bottle)\b/i, imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800' },
  { keywords: /\b(mug|rambler mug)\b/i, imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800' },
  { keywords: /\b(coffee|nespresso|keurig)\b/i, imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800' },
  { keywords: /\b(kettle|fellow|cosori electric kettle)\b/i, imageUrl: 'https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=800' },
  { keywords: /\b(french press|bodum)\b/i, imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800' },
  { keywords: /\b(cleanser|cetaphil|cerave)\b/i, imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800' },
  { keywords: /\b(moisturizer|neutrogena hydro|toleriane|aquaphor)\b/i, imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800' },
  { keywords: /\b(serum|niacinamide|cosrx|mucin)\b/i, imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800' },
  { keywords: /\b(sunscreen|neutrogena ultra)\b/i, imageUrl: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800' },
  { keywords: /\b(mascara|maybelline sky)\b/i, imageUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800' },
  { keywords: /\b(hair dryer|revlon)\b/i, imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800' },
  { keywords: /\b(straightener|chi ceramic)\b/i, imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800' },
  { keywords: /\b(shaver|norelco|conair|cutting kit)\b/i, imageUrl: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=800' },
  { keywords: /\b(flosser|waterpik|oral-b|toothbrush|toothpaste|mouthwash)\b/i, imageUrl: 'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=800' },
  { keywords: /\b(purifier|levoit|honeywell)\b/i, imageUrl: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800' },
  { keywords: /\b(fan|dreo tower)\b/i, imageUrl: 'https://images.unsplash.com/photo-1618941721653-9652a225333f?w=800' },
  { keywords: /\b(heater|space heater)\b/i, imageUrl: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800' },
  { keywords: /\b(mop|steam mop|bissell|vacuum)\b/i, imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800' },
  { keywords: /\b(cloths|microfiber)\b/i, imageUrl: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800' },
  { keywords: /\b(candle|yankee candle)\b/i, imageUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800' },
  { keywords: /\b(sheets|pillow|mattress|bedding)\b/i, imageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800' },
  { keywords: /\b(curtains|blackout)\b/i, imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800' },
  { keywords: /\b(ottoman|furniture)\b/i, imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800' },
  { keywords: /\b(soft cooler|cooler|yeti hopper)\b/i, imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800' },
  { keywords: /\b(chair|coleman camping)\b/i, imageUrl: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800' },
  { keywords: /\b(lifestraw)\b/i, imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=800' },
  { keywords: /\b(headlamp|black diamond)\b/i, imageUrl: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800' },
  { keywords: /\b(backpack|osprey daylite)\b/i, imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800' },
  { keywords: /\b(running watch|garmin forerunner)\b/i, imageUrl: 'https://images.unsplash.com/photo-1510017803434-a899398421b3?w=800' },
  { keywords: /\b(dumbbells|bowflex adjustable)\b/i, imageUrl: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800' },
  { keywords: /\b(resistance bands|fit simplify)\b/i, imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800' },
  { keywords: /\b(yoga mat|manduka)\b/i, imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800' },
  { keywords: /\b(trx|suspension trainer)\b/i, imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800' },
  { keywords: /\b(ball launcher|petsafe|dog|pet)\b/i, imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800' },
]

export function getUniqueProductImage(title: string, categorySlug: string = 'general'): string {
  for (const item of PRODUCT_KEYWORD_IMAGES) {
    if (item.keywords.test(title)) {
      return item.imageUrl
    }
  }

  // Fallback stock images with deterministic hash per title
  const categoryImages: Record<string, string[]> = {
    electronics: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800',
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800',
    ],
    fitness: [
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800',
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800',
    ],
    kitchen: [
      'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800',
    ],
    beauty: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800',
    ],
    default: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
    ],
  }

  const imgs = categoryImages[categorySlug] || categoryImages.default
  let hash = 0
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash)
  }
  return imgs[Math.abs(hash) % imgs.length]
}

function detectCategorySlug(query: string): string {
  const q = query.toLowerCase()
  if (/\b(phone|laptop|watch|tv|headphone|earphone|speaker|camera|ssd|keyboard|mouse|ps5|xbox|gaming|charger|cable|monitor|ipad|tablet|drone|mic|audio)\b/.test(q)) {
    return 'electronics'
  }
  if (/\b(coffee|fryer|blender|pot|cooker|vacuum|roomba|mug|pan|oven|knife|container|table|desk|chair|light|lamp|kitchen|home)\b/.test(q)) {
    return 'home-kitchen'
  }
  if (/\b(skincare|cream|serum|mascara|makeup|lipstick|shampoo|soap|perfume|beauty|lotion)\b/.test(q)) {
    return 'beauty'
  }
  if (/\b(dumbbell|gym|yoga|mat|fitness|band|protein|workout|treadmill|bike|running)\b/.test(q)) {
    return 'fitness'
  }
  if (/\b(shirt|pant|dress|shoe|sneaker|jacket|hat|sunglasses|watch|wallet|bag|fashion)\b/.test(q)) {
    return 'fashion'
  }
  if (/\b(toy|game|lego|puzzle|board|doll|car|action|figure)\b/.test(q)) {
    return 'toys-games'
  }
  if (/\b(dog|cat|pet|leash|food|collar|toy|bed|harness)\b/.test(q)) {
    return 'pet-supplies'
  }
  return 'tech-gadgets'
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function repairInvalidAmazonUrls(rawUrl?: string, title?: string): Promise<string> {
  const tag = process.env.AMAZON_ASSOCIATE_TAG || 'amzfinds063-20'
  if (rawUrl === undefined && title === undefined) {
    try {
      const dbProducts = await prisma.product.findMany()
      for (const p of dbProducts) {
        if (!p.amazonAffiliateUrl || p.amazonAffiliateUrl.includes('/dp/YOUR_') || !p.amazonAffiliateUrl.includes('tag=')) {
          const encTitle = encodeURIComponent(p.title)
          const fixedUrl = `https://www.amazon.com/s?k=${encTitle}&tag=${tag}`
          await prisma.product.update({
            where: { id: p.id },
            data: { amazonAffiliateUrl: fixedUrl },
          })
        }
      }
    } catch (e) {
      console.error('Error repairing DB Amazon URLs:', e)
    }
    return ''
  }

  const url = rawUrl || ''
  const t = title || 'Amazon Product'
  if (!url || url.includes('/dp/YOUR_') || url.includes('ASIN_HERE') || !url.startsWith('http')) {
    const query = encodeURIComponent(t)
    return `https://www.amazon.com/s?k=${query}&tag=${tag}`
  }
  if (!url.includes('tag=')) {
    const separator = url.includes('?') ? '&' : '?'
    return `${url}${separator}tag=${tag}`
  }
  return url
}

export async function ensureSearchProducts(query: string): Promise<number> {
  const trimmedQuery = query.trim()
  if (!trimmedQuery) return 0

  try {
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

    if (existingCount >= 4) return 0

    const targetCatSlug = detectCategorySlug(trimmedQuery)
    const category = await prisma.category.findFirst({
      where: { slug: targetCatSlug },
    })

    let categoryId = category?.id
    if (!categoryId) {
      const newCat = await prisma.category.create({
        data: {
          name: targetCatSlug.replace('-', ' ').toUpperCase(),
          slug: targetCatSlug,
          description: `Auto-created category for ${trimmedQuery}`,
          icon: 'ShoppingBag',
        },
      })
      categoryId = newCat.id
    }

    const tag = process.env.AMAZON_ASSOCIATE_TAG || 'amzfinds063-20'
    const newItems = [
      {
        title: `${trimmedQuery.toUpperCase()} Ultra Pro Deal`,
        slug: slugify(`${trimmedQuery}-ultra-pro-deal-${Date.now()}`),
        price: 29.99,
        originalPrice: 49.99,
      },
      {
        title: `Premium ${trimmedQuery} Choice Find`,
        slug: slugify(`premium-${trimmedQuery}-choice-find-${Date.now()}`),
        price: 49.99,
        originalPrice: 69.99,
      },
      {
        title: `Best Rated ${trimmedQuery} USA Edition`,
        slug: slugify(`best-rated-${trimmedQuery}-usa-edition-${Date.now()}`),
        price: 19.99,
        originalPrice: 29.99,
      },
    ]

    let addedCount = 0
    for (const item of newItems) {
      const searchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(item.title)}&tag=${tag}`
      const imageUrl = getUniqueProductImage(item.title, targetCatSlug)

      await prisma.product.create({
        data: {
          title: item.title,
          slug: item.slug,
          description: `Top-rated Amazon USA recommendation for ${trimmedQuery}. Verified buyer ratings, fast Prime delivery, and authentic customer reviews.`,
          shortDescription: `Top Amazon USA choice for ${trimmedQuery}.`,
          features: JSON.stringify(['Authentic Amazon USA Find', 'Prime Eligible', 'High Customer Rating']),
          categoryId,
          imageUrl,
          amazonAffiliateUrl: searchUrl,
          price: item.price,
          originalPrice: item.originalPrice,
          rating: 4.6 + (addedCount % 4) * 0.1,
          reviewCount: 350 + addedCount * 120,
          isFeatured: true,
          isActive: true,
          seoTitle: `${item.title} - Amazon USA Deal`,
          seoDescription: `Discover ${item.title} on Amazon with best USA affiliate deals.`,
        },
      })
      addedCount++
    }

    return addedCount
  } catch (err) {
    console.error('Error auto-importing search products:', err)
    return 0
  }
}

export function generateOnTheFlySearchProducts(query: string) {
  const tag = process.env.AMAZON_ASSOCIATE_TAG || 'amzfinds063-20'
  const trimmed = query.trim() || 'Amazon Deal'
  const targetCatSlug = detectCategorySlug(trimmed)

  return [
    {
      id: `fly-1-${Date.now()}`,
      title: `${trimmed} High Performance Edition`,
      slug: slugify(`${trimmed}-high-performance-edition`),
      description: `Verified top-tier choice for ${trimmed}. High quality, Prime delivery, and great reviews.`,
      shortDescription: `Top-rated choice for ${trimmed}.`,
      features: JSON.stringify(['Prime Shipping', 'Customer Favorite']),
      imageUrl: getUniqueProductImage(`${trimmed} Edition`, targetCatSlug),
      amazonAffiliateUrl: `https://www.amazon.com/s?k=${encodeURIComponent(trimmed)}&tag=${tag}`,
      price: 39.99,
      originalPrice: 59.99,
      rating: 4.8,
      reviewCount: 940,
      isFeatured: true,
      isActive: true,
      category: { name: 'USA Deals', slug: 'usa-deals' },
    },
    {
      id: `fly-2-${Date.now()}`,
      title: `Best-Selling ${trimmed} USA Choice`,
      slug: slugify(`bestselling-${trimmed}-usa-choice`),
      description: `Popular customer choice for ${trimmed} with thousands of 5-star ratings on Amazon.`,
      shortDescription: `Best-selling USA choice for ${trimmed}.`,
      features: JSON.stringify(['Top Seller', 'Great Value']),
      imageUrl: getUniqueProductImage(`Best-Selling ${trimmed}`, targetCatSlug),
      amazonAffiliateUrl: `https://www.amazon.com/s?k=${encodeURIComponent(trimmed)}&tag=${tag}`,
      price: 24.99,
      originalPrice: 34.99,
      rating: 4.7,
      reviewCount: 1420,
      isFeatured: true,
      isActive: true,
      category: { name: 'USA Deals', slug: 'usa-deals' },
    },
  ]
}
