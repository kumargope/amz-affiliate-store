import React from 'react'
import Link from 'next/link'
import {
  Laptop,
  Home as HomeIcon,
  Sparkles,
  Shirt,
  Dumbbell,
  Gamepad2,
  Dog,
  Wrench,
  Briefcase,
  Compass,
  ArrowUpRight,
} from 'lucide-react'

const iconMap: Record<string, React.ElementType> = {
  Laptop,
  Home: HomeIcon,
  Sparkles,
  Shirt,
  Dumbbell,
  Gamepad2,
  Dog,
  Wrench,
  Briefcase,
  Compass,
}

interface CategoryGridProps {
  categories: Array<{
    id: string
    name: string
    slug: string
    description?: string | null
    icon?: string | null
    _count?: { products: number }
  }>
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  if (!categories || categories.length === 0) return null

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Featured Categories
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Browse top hand-picked products by category
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((cat) => {
            const IconComponent = (cat.icon && iconMap[cat.icon]) || Sparkles
            return (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="group relative p-5 bg-slate-50 border border-slate-200/80 rounded-2xl hover:bg-amber-500 hover:border-amber-500 transition-all duration-300 flex flex-col justify-between h-36 shadow-sm hover:shadow-lg hover:-translate-y-1"
              >
                <div className="w-10 h-10 rounded-xl bg-white text-slate-900 group-hover:bg-slate-950 group-hover:text-amber-400 flex items-center justify-center shadow-sm transition-colors">
                  <IconComponent className="w-5 h-5" />
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 group-hover:text-slate-950 text-sm">
                      {cat.name}
                    </h3>
                    {cat._count?.products !== undefined && (
                      <p className="text-[11px] text-slate-500 group-hover:text-slate-900 font-medium">
                        {cat._count.products} products
                      </p>
                    )}
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-950 transition-colors" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
