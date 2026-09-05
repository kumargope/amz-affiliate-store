import React from 'react'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getAdminFromCookie } from '@/lib/auth'
import ProductForm from '../../ProductForm'

interface EditProductPageProps {
  params: {
    id: string
  }
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const admin = await getAdminFromCookie()
  if (!admin) redirect('/admin/login')

  const product = await prisma.product.findUnique({
    where: { id: params.id },
  })

  if (!product) notFound()

  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true },
  })

  return <ProductForm initialData={product} categories={categories} isEdit />
}
