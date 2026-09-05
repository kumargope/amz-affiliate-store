import React from 'react'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getAdminFromCookie } from '@/lib/auth'
import ProductForm from '../ProductForm'

export default async function NewProductPage() {
  const admin = await getAdminFromCookie()
  if (!admin) redirect('/admin/login')

  let categories: any[] = []

  try {
    categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true },
    })

    if (categories.length === 0) {
      const defaultCategories = [
        { name: 'Electronics', slug: 'electronics', description: 'Headphones, speakers, smart home & devices' },
        { name: 'Home & Kitchen', slug: 'home-kitchen', description: 'Kitchenware, decor, cookware & organization' },
        { name: 'Beauty & Personal Care', slug: 'beauty', description: 'Skincare, grooming, hair care & wellness' },
        { name: 'Fashion & Apparel', slug: 'fashion', description: 'Clothing, shoes, jewelry & accessories' },
        { name: 'Fitness & Sports', slug: 'fitness', description: 'Workout gear, yoga, outdoors & athletic wear' },
        { name: 'Tech Gadgets', slug: 'tech-gadgets', description: 'Cool gadgets, accessories & innovations' },
      ]

      for (const cat of defaultCategories) {
        await prisma.category.upsert({
          where: { slug: cat.slug },
          update: {},
          create: cat,
        })
      }

      categories = await prisma.category.findMany({
        orderBy: { name: 'asc' },
        select: { id: true, name: true },
      })
    }
  } catch (error) {
    console.error('Error fetching categories for new product page:', error)
  }

  return <ProductForm categories={categories} />
}
