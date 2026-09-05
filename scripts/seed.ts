import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // 1. Create Default Admin User
  const adminEmail = 'admin@example.com'
  const hashedPassword = await bcrypt.hash('admin123456', 10)

  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { password: hashedPassword },
    create: {
      email: adminEmail,
      password: hashedPassword,
    },
  })
  console.log(`✅ Admin user configured: ${admin.email}`)

  // 2. Create Categories
  const categoriesData = [
    { name: 'Electronics', slug: 'electronics', description: 'Gadgets, audio gear, smart devices & accessories', icon: 'Laptop', order: 1 },
    { name: 'Home & Kitchen', slug: 'home-kitchen', description: 'Smart appliances, kitchen tools & home decor', icon: 'Home', order: 2 },
    { name: 'Beauty & Personal Care', slug: 'beauty', description: 'Skincare, grooming & self-care essentials', icon: 'Sparkles', order: 3 },
    { name: 'Fashion & Apparel', slug: 'fashion', description: 'Clothing, accessories & footwear', icon: 'Shirt', order: 4 },
    { name: 'Fitness & Sports', slug: 'fitness', description: 'Workout gear, wearables & recovery tools', icon: 'Dumbbell', order: 5 },
    { name: 'Toys & Games', slug: 'toys-games', description: 'Board games, educational toys & puzzles', icon: 'Gamepad2', order: 6 },
    { name: 'Pet Supplies', slug: 'pet-supplies', description: 'Essentials for dogs, cats & pets', icon: 'Dog', order: 7 },
    { name: 'Tools & Home Improvement', slug: 'tools', description: 'DIY equipment, hand tools & hardware', icon: 'Wrench', order: 8 },
    { name: 'Office & Workspace', slug: 'office', description: 'Ergonomic chairs, desks & productivity gear', icon: 'Briefcase', order: 9 },
    { name: 'Lifestyle', slug: 'lifestyle', description: 'Travel accessories, outdoor & daily essentials', icon: 'Compass', order: 10 },
  ]

  const categoryMap = new Map<string, string>()

  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description, icon: cat.icon, order: cat.order },
      create: cat,
    })
    categoryMap.set(cat.slug, created.id)
  }
  console.log(`✅ ${categoriesData.length} categories seeded.`)

  // 3. Create Sample Compliant Products
  const productsData = [
    {
      title: 'Sony WH-1000XM5 Wireless Noise-Canceling Headphones',
      slug: 'sony-wh-1000xm5-wireless-headphones',
      description: 'Industry-leading noise cancellation powered by two processors and 8 microphones. Enjoy crystal clear hands-free calling and impressive 30-hour battery life.',
      shortDescription: 'Premium over-ear noise-canceling headphones with 30-hr battery life.',
      features: JSON.stringify([
        'Industry-leading noise cancellation with Auto NC Optimizer',
        'Magnificent sound engineered with new Integrated Processor V1',
        'Up to 30-hour battery life with quick charging',
        'Ultra-comfortable, lightweight design with soft fit leather',
        'Multipoint connection allows quick switching between devices'
      ]),
      pros: JSON.stringify([
        'Top-tier active noise cancellation',
        'Exceptional mic clarity for calls',
        'Lightweight ergonomic fit',
        'Long battery life with quick charge'
      ]),
      cons: JSON.stringify([
        'Does not fold as compactly as XM4',
        'Premium price point'
      ]),
      categorySlug: 'electronics',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      amazonAffiliateUrl: 'https://www.amazon.com/dp/B09XS7JWHH?tag=amzfinds063-20',
      price: 398.00,
      currency: 'USD',
      rating: 4.6,
      reviewCount: 12450,
      isFeatured: true,
      isDeal: false,
      seoTitle: 'Sony WH-1000XM5 Noise Canceling Headphones Review & Where to Buy',
      seoDescription: 'Discover the Sony WH-1000XM5 wireless noise-canceling headphones featuring 30hr battery life and top-tier audio quality.'
    },
    {
      title: 'Apple iPad Air 11-inch (M2 Chip)',
      slug: 'apple-ipad-air-11-inch-m2',
      description: 'The redesigned 11-inch iPad Air is supercharged by the insanely fast Apple M2 chip. It features a stunning Liquid Retina display, landscape front camera, and fast Wi-Fi 6E.',
      shortDescription: '11-inch Liquid Retina tablet powered by Apple M2 chip.',
      features: JSON.stringify([
        'Stunning 11-inch Liquid Retina display with True Tone and P3 wide color',
        'Apple M2 chip with 8-core CPU and 10-core GPU',
        'Landscape 12MP Ultra Wide front camera with Center Stage',
        'Works with Apple Pencil Pro and Magic Keyboard'
      ]),
      pros: JSON.stringify([
        'Superb M2 performance',
        'Vibrant color-accurate screen',
        'Great battery efficiency',
        'Landscape front camera placement'
      ]),
      cons: JSON.stringify([
        'Accessories sold separately',
        'Base storage is 128GB'
      ]),
      categorySlug: 'electronics',
      imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
      amazonAffiliateUrl: 'https://www.amazon.com/dp/B0D3J7C55H?tag=amzfinds063-20',
      price: 599.00,
      currency: 'USD',
      rating: 4.8,
      reviewCount: 3410,
      isFeatured: true,
      isDeal: false,
      seoTitle: 'Apple iPad Air M2 11-inch Specs, Deals & Features',
      seoDescription: 'Explore the Apple iPad Air 11-inch M2 chip tablet with Liquid Retina display and all-day battery.'
    },
    {
      title: 'Nespresso VertuoPlus Coffee and Espresso Machine by DeLonghi',
      slug: 'nespresso-vertuoplus-coffee-espresso-machine',
      description: 'Single-serve coffee and espresso machine utilizing Centrifusion technology to brew smooth espresso or large drip coffee with a generous crema layer.',
      shortDescription: 'Versatile single-serve coffee maker for espresso and drip coffee.',
      features: JSON.stringify([
        'Brews 5 cup sizes: Espresso, Double Espresso, Gran Lungo, Coffee, and Alto',
        'Precision brewing using automatic barcode reading technology',
        'Fast heat-up time of 25 seconds',
        'Energy-saving automatic shutoff after 9 minutes'
      ]),
      pros: JSON.stringify([
        'Consistent crema on every cup',
        'One-touch automatic brewing',
        'Adjustable water tank position'
      ]),
      cons: JSON.stringify([
        'Requires Nespresso Vertuo capsules',
        'Slightly noisy during spinning'
      ]),
      categorySlug: 'home-kitchen',
      imageUrl: 'https://images.unsplash.com/photo-1517668808822-9eaa03afd2af?auto=format&fit=crop&w=800&q=80',
      amazonAffiliateUrl: 'https://www.amazon.com/dp/B01N7T5F8H?tag=amzfinds063-20',
      price: 159.00,
      originalPrice: 199.00,
      currency: 'USD',
      rating: 4.5,
      reviewCount: 21500,
      isFeatured: true,
      isDeal: true,
      seoTitle: 'Nespresso VertuoPlus Coffee Machine Review & Price',
      seoDescription: 'Find out why the Nespresso VertuoPlus is one of the top single-serve espresso and coffee makers available.'
    },
    {
      title: 'Dyson V15 Detect Cordless Vacuum Cleaner',
      slug: 'dyson-v15-detect-cordless-vacuum-cleaner',
      description: 'Dyson’s most intelligent cordless vacuum. Features precise laser detection to reveal invisible dust on hard floors and an LCD screen showing scientific proof of a deep clean.',
      shortDescription: 'Powerful cordless vacuum with dust-revealing illumination.',
      features: JSON.stringify([
        'Precisely angled illumination makes invisible dust visible on hard floors',
        'Piezo sensor automatically adapts suction power based on debris levels',
        'LCD screen displays run time count-down and performance metrics',
        'Up to 60 minutes of fade-free run time'
      ]),
      pros: JSON.stringify([
        'Exceptional suction power',
        'Laser head highlights micro-dust',
        'Intelligent automatic power adjustment'
      ]),
      cons: JSON.stringify([
        'Relatively heavy in hand',
        'High price investment'
      ]),
      categorySlug: 'home-kitchen',
      imageUrl: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=800&q=80',
      amazonAffiliateUrl: 'https://www.amazon.com/dp/B092L9D65X?tag=amzfinds063-20',
      price: 649.99,
      originalPrice: 749.99,
      currency: 'USD',
      rating: 4.6,
      reviewCount: 8900,
      isFeatured: false,
      isDeal: true,
      seoTitle: 'Dyson V15 Detect Vacuum Cleaner Features & Best Buy Options',
      seoDescription: 'Review and feature breakdown of Dyson V15 Detect intelligent cordless vacuum cleaner.'
    },
    {
      title: 'Anker Magnetic Wireless Power Bank (5,000mAh)',
      slug: 'anker-magnetic-wireless-power-bank-5k',
      description: 'Slim magnetic battery pack designed for iPhone MagSafe series. Features strong magnetic alignment, built-in foldable stand, and USB-C bi-directional charging.',
      shortDescription: 'Compact MagSafe power bank with foldable kickstand.',
      features: JSON.stringify([
        'Snap-and-go magnetic attachment for compatible iPhones',
        'Foldable built-in kickstand keeps phone upright',
        'Compact 0.5-inch thin profile',
        'MultiProtect safety technology keeps devices protected'
      ]),
      pros: JSON.stringify([
        'Strong magnetic grip',
        'Convenient kickstand design',
        'Slim pocketable size'
      ]),
      cons: JSON.stringify([
        '5,000mAh capacity provides ~1 full phone charge',
        'Wired output is faster than wireless'
      ]),
      categorySlug: 'electronics',
      imageUrl: 'https://images.unsplash.com/photo-1609592424109-dd9892f1b177?auto=format&fit=crop&w=800&q=80',
      amazonAffiliateUrl: 'https://www.amazon.com/dp/B099F558ZY?tag=amzfinds063-20',
      price: 39.99,
      originalPrice: 49.99,
      currency: 'USD',
      rating: 4.4,
      reviewCount: 15300,
      isFeatured: true,
      isDeal: true,
      seoTitle: 'Anker Magnetic Wireless Power Bank Review & Specs',
      seoDescription: 'Portable Anker MagSafe power bank with kickstand for iPhone.'
    },
    {
      title: 'Ergonomic Mesh Office Chair with Adjustable Lumbar Support',
      slug: 'ergonomic-mesh-office-chair-lumbar-support',
      description: 'Breathable high-back mesh chair featuring 3D armrests, dynamic lumbar support, tilt mechanism, and smooth-rolling mute wheels for all-day working comfort.',
      shortDescription: 'High-back mesh desk chair engineered for posture and support.',
      features: JSON.stringify([
        'Breathable high-density mesh back keeps you cool',
        'Adjustable lumbar support system protects lower back',
        'Multi-function 3D armrests and 135° recline function',
        'Heavy-duty base certified for stability up to 300 lbs'
      ]),
      pros: JSON.stringify([
        'Excellent lumbar back support',
        'Breathable mesh prevents heat build-up',
        'Highly customizable adjustments'
      ]),
      cons: JSON.stringify([
        'Assembly takes ~20 minutes',
        'Seat cushion is firm'
      ]),
      categorySlug: 'office',
      imageUrl: 'https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?auto=format&fit=crop&w=800&q=80',
      amazonAffiliateUrl: 'https://www.amazon.com/dp/B08C5K2J4Y?tag=amzfinds063-20',
      price: 189.99,
      currency: 'USD',
      rating: 4.4,
      reviewCount: 6400,
      isFeatured: false,
      isDeal: false,
      seoTitle: 'Best Ergonomic Mesh Office Chair for Home Desk Setup',
      seoDescription: 'Find ergonomic comfort with this adjustable mesh office desk chair.'
    }
  ]

  for (const prod of productsData) {
    const categoryId = categoryMap.get(prod.categorySlug)
    if (!categoryId) continue

    const { categorySlug, ...data } = prod
    await prisma.product.upsert({
      where: { slug: data.slug },
      update: { ...data, categoryId },
      create: { ...data, categoryId },
    })
  }
  console.log(`✅ ${productsData.length} sample products seeded.`)

  // 4. Create Site Settings
  const defaultSettings = [
    { key: 'siteName', value: 'AmzFinds' },
    { key: 'siteTagline', value: 'Hand-picked products, useful recommendations, and great finds' },
    { key: 'amazonAssociateTag', value: 'amzfinds-20' },
    { key: 'affiliateDisclosure', value: 'As an Amazon Associate, we earn from qualifying purchases. When you click links on our site to buy products, we may earn an affiliate commission at no additional cost to you.' },
    { key: 'logoUrl', value: '' },
    { key: 'paApiKey', value: '' },
    { key: 'paApiSecret', value: '' },
  ]

  for (const setting of defaultSettings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    })
  }
  console.log('✅ Site settings configured.')
  console.log('🎉 Seeding complete!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
