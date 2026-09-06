import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminFromCookie } from '@/lib/auth'

const CATEGORY_STOCK_IMAGES: Record<string, string[]> = {
  electronics: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800',
    'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800',
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800',
  ],
  'smart-home': [
    'https://images.unsplash.com/photo-1558002038-1055907df827?w=800',
    'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800',
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800',
  ],
  computers: [
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800',
    'https://images.unsplash.com/photo-1609592424089-94073e573c0f?w=800',
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800',
  ],
  audio: [
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800',
  ],
  kitchen: [
    'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800',
    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800',
    'https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=800',
  ],
  beauty: [
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800',
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800',
    'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=800',
  ],
  home: [
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800',
    'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800',
    'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800',
  ],
  outdoor: [
    'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800',
    'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800',
  ],
  fitness: [
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800',
    'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800',
  ],
  default: [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800',
  ],
}

function getRandomImage(catSlug: string, seedStr: string): string {
  const images = CATEGORY_STOCK_IMAGES[catSlug] || CATEGORY_STOCK_IMAGES.default
  let hash = 0
  for (let i = 0; i < seedStr.length; i++) {
    hash = seedStr.charCodeAt(i) + ((hash << 5) - hash)
  }
  const idx = Math.abs(hash) % images.length
  return images[idx]
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  result.push(current.trim())
  return result
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function POST(req: Request) {
  try {
    const admin = await getAdminFromCookie()
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { csvContent } = await req.json()
    if (!csvContent || typeof csvContent !== 'string') {
      return NextResponse.json({ error: 'CSV content string is required' }, { status: 400 })
    }

    const lines = csvContent
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0)

    if (lines.length <= 1) {
      return NextResponse.json({ error: 'CSV file is empty or missing data rows' }, { status: 400 })
    }

    const headers = parseCSVLine(lines[0]).map((h) => h.toLowerCase().replace(/[^a-z0-9]/g, ''))

    let importedCount = 0
    let updatedCount = 0
    const errors: string[] = []

    // Fetch existing categories
    const categoriesMap = new Map<string, string>()
    const dbCategories = await prisma.category.findMany()
    dbCategories.forEach((c) => {
      categoriesMap.set(c.slug, c.id)
      categoriesMap.set(c.name.toLowerCase(), c.id)
    })

    const tag = process.env.AMAZON_ASSOCIATE_TAG || 'amzfinds063-20'

    for (let i = 1; i < lines.length; i++) {
      try {
        const row = parseCSVLine(lines[i])
        if (row.length < 2) continue

        // Map column values dynamically
        let title = ''
        let categoryName = 'General Deals'
        let description = ''
        let affiliateUrl = ''
        let rawImageUrl = ''
        let customSlug = ''
        let seoTitle = ''
        let seoKeywords = ''

        // Check header indices
        headers.forEach((h, colIdx) => {
          const val = row[colIdx] || ''
          if (h.includes('image') || h.includes('img') || h.includes('photo') || h.includes('picture')) {
            rawImageUrl = val
          } else if (h.includes('title') || h.includes('name')) {
            title = val
          } else if (h.includes('category')) {
            categoryName = val
          } else if (h.includes('description')) {
            description = val
          } else if (h.includes('amazon') || h.includes('affiliate') || h.includes('url') || h.includes('link')) {
            affiliateUrl = val
          } else if (h.includes('slug')) {
            customSlug = val
          } else if (h.includes('seotitle')) {
            seoTitle = val
          } else if (h.includes('seokeywords') || h.includes('seodescription')) {
            seoKeywords = val
          }
        })

        // Fallback row mapping by position if header matching failed
        if (!title && row[1]) title = row[1]
        if (!categoryName && row[2]) categoryName = row[2]
        if (!description && row[3]) description = row[3]
        if (!affiliateUrl && row[4]) affiliateUrl = row[4]
        if (!rawImageUrl && row[6]) rawImageUrl = row[6]

        if (!title) continue

        const catSlug = slugify(categoryName || 'General Deals')
        let categoryId = categoriesMap.get(catSlug) || categoriesMap.get(categoryName.toLowerCase())

        // Create Category if it doesn't exist
        if (!categoryId) {
          const newCat = await prisma.category.create({
            data: {
              name: categoryName || 'General Deals',
              slug: catSlug || 'general-deals',
              description: `Top hand-picked ${categoryName} deals on Amazon`,
              icon: 'ShoppingBag',
            },
          })
          categoryId = newCat.id
          categoriesMap.set(catSlug, newCat.id)
        }

        // Clean & Format Affiliate Search URL
        let finalAffiliateUrl = affiliateUrl
        if (!finalAffiliateUrl || !finalAffiliateUrl.startsWith('http')) {
          const encTitle = encodeURIComponent(title)
          finalAffiliateUrl = `https://www.amazon.com/s?k=${encTitle}&tag=${tag}`
        } else if (!finalAffiliateUrl.includes('tag=')) {
          finalAffiliateUrl += (finalAffiliateUrl.includes('?') ? '&' : '?') + `tag=${tag}`
        }

        // Resolve Image URL: If direct image URL is provided (http/https), use it 100% directly!
        let finalImageUrl = rawImageUrl
        const isDirectImage =
          finalImageUrl &&
          (finalImageUrl.startsWith('http://') || finalImageUrl.startsWith('https://')) &&
          !finalImageUrl.toUpperCase().includes('VERIFY VIA')

        if (!isDirectImage) {
          finalImageUrl = getRandomImage(catSlug, title)
        }

        const productSlug = slugify(customSlug || title)
        const priceEst = 19.99 + (Math.abs(slugify(title).length * 3) % 180)

        // Upsert into Database
        const existing = await prisma.product.findUnique({
          where: { slug: productSlug },
        })

        if (existing) {
          await prisma.product.update({
            where: { id: existing.id },
            data: {
              title,
              description,
              shortDescription: description.substring(0, 140),
              amazonAffiliateUrl: finalAffiliateUrl,
              imageUrl: finalImageUrl,
              categoryId,
              seoTitle: seoTitle || `${title} - Amazon Affiliate Review & Deals`,
              seoDescription: seoKeywords || `${title}, Amazon USA, deals`,
            },
          })
          updatedCount++
        } else {
          await prisma.product.create({
            data: {
              title,
              slug: productSlug,
              description,
              shortDescription: description.substring(0, 140),
              price: priceEst,
              originalPrice: priceEst * 1.25,
              amazonAffiliateUrl: finalAffiliateUrl,
              imageUrl: finalImageUrl,
              categoryId,
              rating: 4.5 + (title.length % 5) * 0.1,
              reviewCount: 100 + (title.length * 17) % 900,
              isFeatured: true,
              isActive: true,
              features: JSON.stringify(['Authentic Amazon Find', 'Top Customer Rating', 'Fast USA Shipping']),
              seoTitle: seoTitle || `${title} - Amazon Affiliate Review & Deals`,
              seoDescription: seoKeywords || `${title}, Amazon USA, deals`,
            },
          })
          importedCount++
        }
      } catch (rowErr: any) {
        errors.push(`Row ${i + 1}: ${rowErr.message}`)
      }
    }

    return NextResponse.json({
      success: true,
      importedCount,
      updatedCount,
      totalProcessed: importedCount + updatedCount,
      errors,
    })
  } catch (err: any) {
    console.error('CSV import error:', err)
    return NextResponse.json({ error: err.message || 'Failed to process CSV' }, { status: 500 })
  }
}
