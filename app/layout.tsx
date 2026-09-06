import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AffiliateDisclosure from '@/components/AffiliateDisclosure'
import SpinWinRewardModal from '@/components/SpinWinRewardModal'
import { prisma } from '@/lib/prisma'

const inter = Inter({ subsets: ['latin'] })

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://amz-affiliate-store.vercel.app'
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: 'AmzFinds | Discover Hand-Picked Amazon Products',
      template: '%s | AmzFinds',
    },
    description:
      'Curated Amazon product discovery storefront. Hand-picked products, authentic recommendations, and direct Amazon affiliate deals.',
    icons: {
      icon: '/logo.png',
      shortcut: '/logo.png',
      apple: '/logo.png',
    },
    verification: {
      google: 'google0479d8ab26f8c30d',
      other: {
        'p:domain_verify': '52fc436f906da3c2e83935b9d6f33d20',
      },
    },
    alternates: {
      types: {
        'application/rss+xml': `${siteUrl}/api/rss`,
      },
    },
    openGraph: {
      title: 'AmzFinds | Discover Hand-Picked Amazon Products',
      description:
        'Curated Amazon product discovery storefront. Hand-picked products, authentic recommendations, and direct Amazon affiliate deals.',
      url: siteUrl,
      siteName: 'AmzFinds',
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: '/logo.png',
          width: 512,
          height: 512,
          alt: 'AmzFinds Logo',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AmzFinds | Discover Hand-Picked Amazon Products',
      description:
        'Curated Amazon product discovery storefront. Hand-picked products, authentic recommendations, and direct Amazon affiliate deals.',
      images: ['/logo.png'],
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let categories: { name: string; slug: string }[] = []
  try {
    categories = await prisma.category.findMany({
      select: { name: true, slug: true },
      orderBy: { order: 'asc' },
    })
  } catch (error) {
    // Graceful fallback if database is seeding
  }

  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} flex flex-col min-h-screen relative`}>
        <AffiliateDisclosure variant="banner" />
        <Navbar categories={categories} />
        <main className="flex-1">{children}</main>
        <SpinWinRewardModal />
        <Footer />
      </body>
    </html>
  )
}
