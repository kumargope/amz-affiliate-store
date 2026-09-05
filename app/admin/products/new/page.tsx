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
  } catch (error) {
    console.error('Error fetching categories for new product page:', error)
  }

  return <ProductForm categories={categories} />
}
