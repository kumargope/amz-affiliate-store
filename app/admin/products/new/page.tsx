import React from 'react'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getAdminFromCookie } from '@/lib/auth'
import ProductForm from '../ProductForm'

export default async function NewProductPage() {
  const admin = await getAdminFromCookie()
  if (!admin) redirect('/admin/login')

  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true },
  })

  return <ProductForm categories={categories} />
}
