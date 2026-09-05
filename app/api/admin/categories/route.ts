import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminFromCookie } from '@/lib/auth'

export async function GET() {
  try {
    let rawCategories = await prisma.category.findMany({
      orderBy: { order: 'asc' },
      include: { products: { select: { id: true } } },
    })

    if (rawCategories.length === 0) {
      const defaultCategories = [
        { name: 'Electronics', slug: 'electronics', description: 'Headphones, speakers, smart home & devices', icon: 'Laptop', order: 1 },
        { name: 'Home & Kitchen', slug: 'home-kitchen', description: 'Kitchenware, decor, cookware & organization', icon: 'Home', order: 2 },
        { name: 'Beauty & Personal Care', slug: 'beauty', description: 'Skincare, grooming, hair care & wellness', icon: 'Sparkles', order: 3 },
        { name: 'Fashion & Apparel', slug: 'fashion', description: 'Clothing, shoes, jewelry & accessories', icon: 'Shirt', order: 4 },
        { name: 'Fitness & Sports', slug: 'fitness', description: 'Workout gear, yoga, outdoors & athletic wear', icon: 'Dumbbell', order: 5 },
        { name: 'Tech Gadgets', slug: 'tech-gadgets', description: 'Cool gadgets, accessories & innovations', icon: 'Laptop', order: 6 },
      ]

      for (const cat of defaultCategories) {
        await prisma.category.upsert({
          where: { slug: cat.slug },
          update: {},
          create: cat,
        })
      }

      rawCategories = await prisma.category.findMany({
        orderBy: { order: 'asc' },
        include: { products: { select: { id: true } } },
      })
    }

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
