import React from 'react'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getAdminFromCookie } from '@/lib/auth'
import CategoryManager from './CategoryManager'

export default async function AdminCategoriesPage() {
  const admin = await getAdminFromCookie()
  if (!admin) redirect('/admin/login')

  let categories: any[] = []

  try {
    let raw = await prisma.category.findMany({
      orderBy: { order: 'asc' },
      include: { products: { select: { id: true } } },
    })

    if (raw.length === 0) {
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

      raw = await prisma.category.findMany({
        orderBy: { order: 'asc' },
        include: { products: { select: { id: true } } },
      })
    }

    categories = raw.map((c) => ({
      ...c,
      _count: { products: c.products ? c.products.length : 0 },
    }))
  } catch (error) {
    console.error('Error fetching categories for admin categories page:', error)
  }

  return <CategoryManager initialCategories={categories} />
}
