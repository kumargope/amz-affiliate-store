'use client'

import React, { useState } from 'react'
import { Trash2 } from 'lucide-react'

interface DeleteProductButtonProps {
  productId: string
  title: string
}

export default function DeleteProductButton({ productId, title }: DeleteProductButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return

    setLoading(true)
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        window.location.reload()
      } else {
        alert('Failed to delete product')
      }
    } catch {
      alert('Error deleting product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50"
      title="Delete Product"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}
