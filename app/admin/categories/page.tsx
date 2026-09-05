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
    categories = await prisma.category.findMany({
      orderBy: { order: 'asc' },
      include: { _count: { select: { products: true } } },
    })
  } catch (error) {
    console.error('Error fetching categories for admin categories page:', error)
  }

  return <CategoryManager initialCategories={categories} />
}
