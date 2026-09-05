import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminFromCookie } from '@/lib/auth'
import { buildAffiliateUrl } from '@/lib/affiliate'

// PUT /api/admin/products/[id] - Update product
export async function PUT(req: Request, { params }: { params: { id: string } }) {
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

    const cleanAffiliateUrl = amazonAffiliateUrl ? buildAffiliateUrl(amazonAffiliateUrl) : undefined

    const updated = await prisma.product.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(slug && { slug }),
        ...(description && { description }),
        ...(shortDescription && { shortDescription }),
        ...(features !== undefined && { features: typeof features === 'string' ? features : JSON.stringify(features) }),
        ...(pros !== undefined && { pros: typeof pros === 'string' ? pros : JSON.stringify(pros) }),
        ...(cons !== undefined && { cons: typeof cons === 'string' ? cons : JSON.stringify(cons) }),
        ...(categoryId && { categoryId }),
        ...(imageUrl && { imageUrl }),
        ...(cleanAffiliateUrl && { amazonAffiliateUrl: cleanAffiliateUrl }),
        price: price !== undefined && price !== '' && price !== null ? parseFloat(price) : null,
        originalPrice: originalPrice !== undefined && originalPrice !== '' && originalPrice !== null ? parseFloat(originalPrice) : null,
        rating: rating !== undefined && rating !== '' && rating !== null ? parseFloat(rating) : null,
        reviewCount: reviewCount !== undefined && reviewCount !== '' && reviewCount !== null ? parseInt(reviewCount) : null,
        ...(isFeatured !== undefined && { isFeatured: Boolean(isFeatured) }),
        ...(isDeal !== undefined && { isDeal: Boolean(isDeal) }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
        ...(seoTitle !== undefined && { seoTitle }),
        ...(seoDescription !== undefined && { seoDescription }),
      },
    })

    return NextResponse.json({ success: true, product: updated })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

// DELETE /api/admin/products/[id] - Delete product
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const admin = await getAdminFromCookie()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await prisma.product.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
