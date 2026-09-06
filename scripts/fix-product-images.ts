import { prisma } from '../lib/prisma'
import { getUniqueProductImage } from '../lib/auto-search-importer'

async function main() {
  console.log('🔄 Updating product images to match product titles uniquely...')

  const products = await prisma.product.findMany({
    include: { category: true },
  })

  let updatedCount = 0

  for (const product of products) {
    const newImage = getUniqueProductImage(product.title, product.category.slug)
    await prisma.product.update({
      where: { id: product.id },
      data: { imageUrl: newImage },
    })
    updatedCount++
  }

  console.log(`✅ Successfully updated ${updatedCount} products with unique title-matched images!`)
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('Error updating product images:', e)
    process.exit(1)
  })
