import React from 'react'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getAdminFromCookie } from '@/lib/auth'
import CategoryManager from './CategoryManager'

export default async function AdminCategoriesPage() {
  const admin = await getAdminFromCookie()
  if (!admin) redirect('/admin/login')

  const categories = await prisma.category.findMany({
    orderBy: { order: 'asc' },
    include: { _count: { select: { products: true } } },
  })

  return <CategoryManager initialCategories={categories} />
}
