import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminFromCookie } from '@/lib/auth'
import { buildAffiliateUrl } from '@/lib/affiliate'

// GET /api/admin/products - List products
export async function GET() {
  const admin = await getAdminFromCookie()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      _count: { select: { clicks: true } },
    },
  })

  return NextResponse.json({ products })
}

// POST /api/admin/products - Create product
export async function POST(req: Request) {
  const admin = await getAdminFromCookie()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const {
      title,
      slug,
      description,
      shortDescription,
      features,
      pros,
      cons,
      categoryId,
      imageUrl,
      amazonAffiliateUrl,
      price,
      originalPrice,
      rating,
      reviewCount,
      isFeatured,
      isDeal,
      isActive,
      seoTitle,
      seoDescription,
    } = body

    if (!title || !description || !shortDescription || !categoryId || !imageUrl || !amazonAffiliateUrl) {
      return NextResponse.json({ error: 'Missing required product fields' }, { status: 400 })
    }

    const formattedSlug = (slug || title)
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')

    const cleanAffiliateUrl = buildAffiliateUrl(amazonAffiliateUrl)

    const product = await prisma.product.create({
      data: {
        title,
        slug: formattedSlug,
        description,
        shortDescription,
        features: typeof features === 'string' ? features : JSON.stringify(features || []),
        pros: typeof pros === 'string' ? pros : JSON.stringify(pros || []),
        cons: typeof cons === 'string' ? cons : JSON.stringify(cons || []),
        categoryId,
        imageUrl,
        amazonAffiliateUrl: cleanAffiliateUrl,
        price: price !== undefined && price !== '' ? parseFloat(price) : null,
        originalPrice: originalPrice !== undefined && originalPrice !== '' ? parseFloat(originalPrice) : null,
        rating: rating !== undefined && rating !== '' ? parseFloat(rating) : null,
        reviewCount: reviewCount !== undefined && reviewCount !== '' ? parseInt(reviewCount) : null,
        isFeatured: Boolean(isFeatured),
        isDeal: Boolean(isDeal),
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        seoTitle: seoTitle || title,
        seoDescription: seoDescription || shortDescription,
      },
    })

    return NextResponse.json({ success: true, product })
  } catch (error: any) {
    console.error('Error creating product:', error)
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Product slug already exists' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
