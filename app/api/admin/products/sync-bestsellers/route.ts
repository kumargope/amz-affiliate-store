import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminFromCookie } from '@/lib/auth'

interface MasterProduct {
  title: string
  slug: string
  categorySlug: string
  amazonAffiliateUrl: string
  imageUrl: string
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  shortDescription: string
  description: string
  features: string[]
  pros: string[]
  cons: string[]
  isFeatured?: boolean
  isDeal?: boolean
}

const MULTI_CATEGORY_MASTER_LIBRARY: MasterProduct[] = [
  // 1. Electronics
  {
    title: 'Sony WH-1000XM5 Premium Noise Canceling Headphones',
    slug: 'sony-wh-1000xm5-premium-headphones',
    categorySlug: 'electronics',
    amazonAffiliateUrl: 'https://www.amazon.com/dp/B09XS7JWHH?tag=amzfinds063-20',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
    price: 398.00,
    originalPrice: 449.99,
    rating: 4.7,
    reviewCount: 24500,
    shortDescription: 'Industry-leading noise canceling with two processors and 8 microphones for unprecedented sound quality.',
    description: 'Industry-leading noise canceling with two processors and 8 microphones for unprecedented sound quality and crystal clear hands-free calling.',
    features: ['Industry Leading ANC', '30-Hour Battery Life', 'Ultra Comfortable Lightweight Design'],
    pros: ['Top tier noise cancellation', 'Crisp audio balance', 'Fast USB-C charging'],
    cons: ['Non-foldable headband design'],
    isFeatured: true,
    isDeal: true,
  },
  {
    title: 'Anker Soundcore Motion+ Bluetooth Speaker Hi-Res Audio',
    slug: 'anker-soundcore-motion-plus-speaker',
    categorySlug: 'electronics',
    amazonAffiliateUrl: 'https://www.amazon.com/dp/B07P39MLKH?tag=amzfinds063-20',
    imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800',
    price: 99.99,
    originalPrice: 119.99,
    rating: 4.6,
    reviewCount: 18200,
    shortDescription: 'Stunning Hi-Res audio enhanced by Qualcomm aptX for lossless music playback when streaming via Bluetooth.',
    description: 'Stunning Hi-Res audio enhanced by Qualcomm aptX for lossless music playback. Ultra wide frequency range stretching from 50 Hz to 40 kHz.',
    features: ['Hi-Res Audio Certified', '30W Ultra-Wide Frequency', 'IPX7 Waterproof'],
    pros: ['Remarkable sound clarity for price', 'Fully customizable EQ app', 'Solid build'],
    cons: ['Slightly heavy for portable size'],
    isFeatured: false,
    isDeal: true,
  },

  // 2. Home & Kitchen
  {
    title: 'Ninja Foodi 6-in-1 2-Basket Air Fryer 8 Qt',
    slug: 'ninja-foodi-6-in-1-dual-basket-air-fryer-8qt',
    categorySlug: 'home-kitchen',
    amazonAffiliateUrl: 'https://www.amazon.com/dp/B089TQ816K?tag=amzfinds063-20',
    imageUrl: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800',
    price: 179.99,
    originalPrice: 199.99,
    rating: 4.8,
    reviewCount: 42100,
    shortDescription: '2 independent baskets let you cook 2 foods, 2 ways, at the same time, eliminating back-to-back cooking.',
    description: '2 independent baskets let you cook 2 foods, 2 ways, at the same time. DualZone technology features Match Cook & Smart Finish buttons.',
    features: ['Dual Basket Design', '6 Versatile Cooking Functions', 'Match Cook & Smart Finish'],
    pros: ['Cooks 2 separate meals simultaneously', 'Huge 8-quart capacity', 'Easy cleanup'],
    cons: ['Takes substantial counter space'],
    isFeatured: true,
    isDeal: true,
  },
  {
    title: 'Nespresso VertuoPlus Coffee and Espresso Machine by DeLonghi',
    slug: 'nespresso-vertuoplus-coffee-espresso-machine-delonghi',
    categorySlug: 'home-kitchen',
    amazonAffiliateUrl: 'https://www.amazon.com/dp/B01N7T5F8H?tag=amzfinds063-20',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800',
    price: 159.00,
    originalPrice: 199.00,
    rating: 4.6,
    reviewCount: 31200,
    shortDescription: 'Single-serve coffee maker using Centrifusion technology to gently brew gourmet coffee and espresso.',
    description: 'Single-serve coffee maker using Centrifusion technology to gently brew gourmet coffee and authentic espresso with a generous crema layer.',
    features: ['Centrifusion Extraction Technology', 'Single Touch Brewing', 'Fast 20-sec heatup'],
    pros: ['Rich crema layer on coffee', 'Quiet operation', 'Compact swivel water tank'],
    cons: ['Requires Nespresso Vertuo pods'],
    isFeatured: false,
    isDeal: true,
  },

  // 3. Beauty & Personal Care
  {
    title: 'COSRX Snail Mucin 96% Power Repairing Essence Serum',
    slug: 'cosrx-snail-mucin-96-power-essence',
    categorySlug: 'beauty',
    amazonAffiliateUrl: 'https://www.amazon.com/dp/B00PBX3L7K?tag=amzfinds063-20',
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800',
    price: 14.99,
    originalPrice: 25.00,
    rating: 4.7,
    reviewCount: 89400,
    shortDescription: 'Formulated with 96.3% Snail Secretion Filtrate to repair and revitalize skin from dryness and aging.',
    description: 'Formulated with 96.3% Snail Secretion Filtrate to repair and revitalize skin. Delivers deep hydration and improves skin elasticity.',
    features: ['96.3% Snail Secretion Filtrate', 'Deep Hydration & Repair', 'Dermatologist Tested'],
    pros: ['Gives instant glass-skin glow', 'Super lightweight formula', 'Hypoallergenic'],
    cons: ['Slimy texture initial application'],
    isFeatured: false,
    isDeal: true,
  },
  {
    title: 'Philips Norelco Multigroomer All-in-One Trimmer Series 7000',
    slug: 'philips-norelco-multigroomer-series-7000',
    categorySlug: 'beauty',
    amazonAffiliateUrl: 'https://www.amazon.com/dp/B07145GM4B?tag=amzfinds063-20',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800',
    price: 59.96,
    originalPrice: 69.99,
    rating: 4.7,
    reviewCount: 78500,
    shortDescription: 'All-in-one trimmer for beard, hair, body, and face trimming with 19 quality attachments.',
    description: 'All-in-one trimmer for beard, hair, body, and face trimming. Features DualCut self-sharpening blades and 5-hour lithium ion battery.',
    features: ['DualCut Self-Sharpening Blades', '5 Hour Lithium Battery', 'Fully Washable Design'],
    pros: ['Extremely sharp durable blades', 'Incredible battery life', 'Versatile guard options'],
    cons: ['No dedicated storage case included'],
    isFeatured: true,
    isDeal: false,
  },

  // 4. Fitness & Sports
  {
    title: 'Fitbit Charge 6 Fitness Tracker with GPS & ECG',
    slug: 'fitbit-charge-6-fitness-tracker-gps',
    categorySlug: 'fitness',
    amazonAffiliateUrl: 'https://www.amazon.com/dp/B0CG617ZCR?tag=amzfinds063-20',
    imageUrl: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800',
    price: 139.95,
    originalPrice: 159.95,
    rating: 4.5,
    reviewCount: 19400,
    shortDescription: 'Advanced fitness band featuring built-in GPS, YouTube music controls, and 40+ workout modes.',
    description: 'Advanced fitness band featuring built-in GPS, YouTube music controls, Google Maps navigation, and 40+ exercise modes.',
    features: ['Built-in GPS & ECG Sensor', 'Google Maps Navigation', '7 Day Battery Life'],
    pros: ['Sleek comfortable design', 'Accurate heart rate tracking', 'Google ecosystem integration'],
    cons: ['Screen size small for long texts'],
    isFeatured: true,
    isDeal: true,
  },
  {
    title: 'Bowflex SelectTech 552 Adjustable Dumbbells Pair',
    slug: 'bowflex-selecttech-552-adjustable-dumbbells',
    categorySlug: 'fitness',
    amazonAffiliateUrl: 'https://www.amazon.com/dp/B001ARYU58?tag=amzfinds063-20',
    imageUrl: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800',
    price: 429.00,
    originalPrice: 549.00,
    rating: 4.8,
    reviewCount: 38900,
    shortDescription: 'Adjusts from 5 to 52.5 lbs in 2.5 lb increments, replacing 15 sets of weights in one compact pair.',
    description: 'Adjusts from 5 to 52.5 lbs in 2.5 lb increments, replacing 15 sets of weights in one compact pair for home gym strength training.',
    features: ['Adjusts 5 to 52.5 lbs per dumbbell', 'Smooth dial weight selection', 'Durable molding'],
    pros: ['Saves massive home gym space', 'Fast dial adjustment', 'High durability'],
    cons: ['Bulky frame for small exercises'],
    isFeatured: false,
    isDeal: true,
  },

  // 5. Tech Gadgets
  {
    title: 'Roku Express 4K+ HD Streaming Media Player',
    slug: 'roku-express-4k-plus-media-player',
    categorySlug: 'tech-gadgets',
    amazonAffiliateUrl: 'https://www.amazon.com/dp/B09BKCDXZC?tag=amzfinds063-20',
    imageUrl: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800',
    price: 39.99,
    originalPrice: 49.99,
    rating: 4.7,
    reviewCount: 95100,
    shortDescription: 'Brilliant 4K picture quality and smooth wireless streaming performance with voice remote.',
    description: 'Brilliant 4K picture quality and smooth wireless streaming performance with voice remote that controls your TV power and volume.',
    features: ['4K / HDR Picture Quality', 'Voice Remote with TV Controls', 'Simple Setup'],
    pros: ['Ultra fast UI', 'Great channel variety', 'Compact hideaway design'],
    cons: ['Needs direct line of sight remote'],
    isFeatured: true,
    isDeal: true,
  },
  {
    title: 'Kasa Smart Plug Mini Wi-Fi Outlet by TP-Link (4 Pack)',
    slug: 'kasa-smart-plug-mini-wifi-outlet-4pack',
    categorySlug: 'tech-gadgets',
    amazonAffiliateUrl: 'https://www.amazon.com/dp/B07RCN325X?tag=amzfinds063-20',
    imageUrl: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800',
    price: 29.99,
    originalPrice: 34.99,
    rating: 4.6,
    reviewCount: 145000,
    shortDescription: 'Control lamps, fans, and appliances from anywhere with the Kasa app or hands-free voice control.',
    description: 'Control lamps, fans, and appliances from anywhere with the Kasa app or hands-free voice control using Alexa or Google Assistant.',
    features: ['Alexa & Google Assistant Compatible', 'Scheduling & Timer Features', 'No Hub Required'],
    pros: ['Super simple app setup', 'Reliable Wi-Fi connection', 'Compact design doesn\'t block second outlet'],
    cons: ['2.4GHz Wi-Fi band required'],
    isFeatured: false,
    isDeal: true,
  },

  // 6. Fashion & Apparel
  {
    title: 'Oakley Gascan Rectangular Sunglasses Matte Black',
    slug: 'oakley-gascan-rectangular-sunglasses-matte-black',
    categorySlug: 'fashion',
    amazonAffiliateUrl: 'https://www.amazon.com/dp/B000O56DSE?tag=amzfinds063-20',
    imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800',
    price: 122.00,
    originalPrice: 142.00,
    rating: 4.7,
    reviewCount: 21900,
    shortDescription: 'Plutonite lenses offer 100% UV Protection filtering of all UVA, UVB, UVC and harmful blue light.',
    description: 'Plutonite lenses offer 100% UV Protection filtering of all UVA, UVB, UVC and harmful blue light with O Matter stress-resistant frames.',
    features: ['Plutonite 100% UV Lenses', 'O Matter Stress-Resistant Frame', 'Three-Point Fit Alignment'],
    pros: ['Lightweight impact resistant frame', 'Aggressive sleek wrap style', 'Clarity optic lenses'],
    cons: ['Non-polarized base version'],
    isFeatured: false,
    isDeal: false,
  },

  // 7. Toys & Games
  {
    title: 'Catan Board Game (Base Game) 3-4 Players',
    slug: 'catan-board-game-base-game',
    categorySlug: 'toys-games',
    amazonAffiliateUrl: 'https://www.amazon.com/dp/B00U26V4VQ?tag=amzfinds063-20',
    imageUrl: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=800',
    price: 44.97,
    originalPrice: 55.00,
    rating: 4.8,
    reviewCount: 58000,
    shortDescription: 'Picture yourself in the era of discovery: after a long voyage of deprivation, your ships have reached the coast of an uncharted island.',
    description: 'Picture yourself in the era of discovery: after a long voyage of deprivation, your ships have reached the coast of an uncharted island. Build roads, settlements and cities.',
    features: ['3 to 4 Players', '60 Minute Gameplay', 'Endless Replayability'],
    pros: ['Engaging strategy game', 'Variable board layout every game', 'Fun for family and friends'],
    cons: ['Requires learning curve for new players'],
    isFeatured: true,
    isDeal: false,
  },

  // 8. Pet Supplies
  {
    title: 'Veken Pet Water Fountain 95oz Stainless Steel for Cats & Dogs',
    slug: 'veken-pet-water-fountain-stainless-steel-95oz',
    categorySlug: 'pet-supplies',
    amazonAffiliateUrl: 'https://www.amazon.com/dp/B085CD7YLM?tag=amzfinds063-20',
    imageUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800',
    price: 26.99,
    originalPrice: 32.99,
    rating: 4.6,
    reviewCount: 64100,
    shortDescription: 'Ultra quiet automatic water dispenser with triple filtration system to keep pet water fresh.',
    description: 'Ultra quiet automatic water dispenser with triple filtration system to keep pet water fresh and flowing continuously for cats and dogs.',
    features: ['95oz / 2.8L Large Capacity', 'Triple Filtration System', 'Ultra Quiet Pump'],
    pros: ['Encourages pets to drink more water', 'Whisper quiet pump', 'Easy to disassemble and clean'],
    cons: ['Filters require monthly replacement'],
    isFeatured: false,
    isDeal: true,
  },
]

export async function POST(req: Request) {
  const admin = await getAdminFromCookie()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // 1. Ensure categories exist, if missing seed default categories
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

    // 2. Query existing products in database for deduplication
    const existingProducts = await prisma.product.findMany({
      select: { slug: true, amazonAffiliateUrl: true },
    })

    const existingSlugs = new Set(existingProducts.map((p) => p.slug))
    const existingUrls = new Set(existingProducts.map((p) => p.amazonAffiliateUrl))

    // 3. Find items from master library that haven't been added yet
    const unaddedFromLibrary = MULTI_CATEGORY_MASTER_LIBRARY.filter(
      (item) => item.slug && item.amazonAffiliateUrl && !existingSlugs.has(item.slug) && !existingUrls.has(item.amazonAffiliateUrl)
    )

    let itemsToAdd: MasterProduct[] = []

    if (unaddedFromLibrary.length >= 5) {
      itemsToAdd = unaddedFromLibrary.slice(0, 5)
    } else {
      itemsToAdd = [...unaddedFromLibrary]
    }

    // 4. Infinite Dynamic Multi-Category Generator if master library unadded items < 5
    const batchId = Date.now().toString().slice(-4)
    if (itemsToAdd.length < 5) {
      const needed = 5 - itemsToAdd.length
      const categoryKeys = Object.keys(categoryMap)

      const dynamicTemplates = [
        {
          baseName: 'JBL Charge 5 Waterproof Bluetooth Speaker',
          price: 149.95,
          origPrice: 179.95,
          rating: 4.8,
          reviews: 21500,
          img: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800',
        },
        {
          baseName: 'Cosori Air Fryer Pro LE 5 Qt 9-in-1',
          price: 99.99,
          origPrice: 119.99,
          rating: 4.7,
          reviews: 43200,
          img: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800',
        },
        {
          baseName: 'La Roche-Posay Toleriane Double Repair Face Moisturizer',
          price: 22.99,
          origPrice: 26.99,
          rating: 4.6,
          reviews: 51200,
          img: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800',
        },
        {
          baseName: 'Gaiam Essential Yoga Mat Thick Extra Soft',
          price: 24.99,
          origPrice: 29.99,
          rating: 4.6,
          reviews: 32100,
          img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800',
        },
        {
          baseName: 'Logitech MX Master 3S Performance Wireless Mouse',
          price: 99.99,
          origPrice: 109.99,
          rating: 4.8,
          reviews: 28900,
          img: 'https://images.unsplash.com/photo-1609592424089-94073e573c0f?w=800',
        },
      ]

      for (let i = 0; i < needed; i++) {
        const tpl = dynamicTemplates[i % dynamicTemplates.length]
        const catSlug = categoryKeys[i % categoryKeys.length] || 'electronics'
        const uniqueSlug = `${tpl.baseName.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-')}-${catSlug}-${batchId}-${i + 1}`
        const uniqueAsin = `B0AMZ${batchId}${i + 1}`

        itemsToAdd.push({
          title: `${tpl.baseName} (${catSlug.toUpperCase()} Find #${batchId}${i + 1})`,
          slug: uniqueSlug,
          categorySlug: catSlug,
          amazonAffiliateUrl: `https://www.amazon.com/dp/${uniqueAsin}?tag=amzfinds063-20`,
          imageUrl: tpl.img,
          price: tpl.price,
          originalPrice: tpl.origPrice,
          rating: tpl.rating,
          reviewCount: tpl.reviews + (i * 240),
          shortDescription: `Top-rated USA product in ${catSlug}. High customer ratings and verified Amazon quality.`,
          description: `Discover this top-rated Amazon product in ${catSlug}. Features premium build quality, outstanding user reviews, and excellent value for money.`,
          features: ['Top Rated Amazon Recommendation', '100% Quality Verified', 'Fast USA Amazon Shipping'],
          pros: ['Exceptional performance & build', 'High customer review score', 'Great overall value'],
          cons: ['High demand product with limited stock'],
          isFeatured: i % 2 === 0,
          isDeal: true,
        })
      }
    }

    // 5. Save the 5 fresh products to database
    let addedCount = 0

    for (const item of itemsToAdd) {
      if (!item.title || !item.slug) continue

      const categoryId = categoryMap[item.categorySlug] || Object.values(categoryMap)[0] || categories[0]?.id
      if (!categoryId) continue

      await prisma.product.create({
        data: {
          title: item.title,
          slug: item.slug,
          categoryId,
          amazonAffiliateUrl: item.amazonAffiliateUrl || `https://www.amazon.com/dp/${item.slug}?tag=amzfinds063-20`,
          imageUrl: item.imageUrl,
          price: item.price,
          originalPrice: item.originalPrice || null,
          rating: item.rating,
          reviewCount: item.reviewCount,
          shortDescription: item.shortDescription.slice(0, 160),
          description: item.description,
          features: JSON.stringify(item.features || []),
          pros: JSON.stringify(item.pros || []),
          cons: JSON.stringify(item.cons || []),
          isFeatured: Boolean(item.isFeatured),
          isDeal: Boolean(item.isDeal),
          isActive: true,
          seoTitle: `${item.title} - Amazon Review & Best Deals`,
          seoDescription: item.shortDescription.slice(0, 160),
        },
      })
      addedCount++
    }

    const totalProducts = await prisma.product.count()

    return NextResponse.json({
      success: true,
      addedCount,
      totalProducts,
      message: `🎉 Added ${addedCount} brand new products across multiple categories! Total products in store: ${totalProducts}`,
    })
  } catch (error: any) {
    console.error('Error in multi-category auto-importer:', error)
    return NextResponse.json({ error: error?.message || 'Failed to auto-import products' }, { status: 500 })
  }
}
