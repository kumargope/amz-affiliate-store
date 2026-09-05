import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminFromCookie } from '@/lib/auth'

export async function GET() {
  try {
    const rawCategories = await prisma.category.findMany({
      orderBy: { order: 'asc' },
      include: { products: { select: { id: true } } },
    })

    const categories = rawCategories.map((cat) => ({
      ...cat,
      _count: { products: cat.products ? cat.products.length : 0 },
    }))

    return NextResponse.json({ categories })
  } catch (error) {
    return NextResponse.json({ categories: [] })
  }
}

export async function POST(req: Request) {
  const admin = await getAdminFromCookie()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { name, slug, description, icon, order } = await req.json()
    if (!name) return NextResponse.json({ error: 'Category name is required' }, { status: 400 })

    const formattedSlug = (slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')

    const category = await prisma.category.upsert({
      where: { slug: formattedSlug },
      update: {
        name,
        description,
        icon,
        order: order ? parseInt(order) : 0,
      },
      create: {
        name,
        slug: formattedSlug,
        description,
        icon,
        order: order ? parseInt(order) : 0,
      },
    })

    return NextResponse.json({ success: true, category })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}
