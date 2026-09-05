const { execSync } = require('child_process')

// Ensure DATABASE_URL has a fallback if not provided in environment
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./dev.db'
}

console.log('🚀 Running production build with DATABASE_URL:', process.env.DATABASE_URL)

try {
  // 1. Prisma Generate
  console.log('📦 Generating Prisma Client...')
  execSync('npx prisma generate', { stdio: 'inherit', env: process.env })

  // 2. Prisma DB Push (create tables if SQLite)
  console.log('🗄️ Syncing Database Schema...')
  execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit', env: process.env })

  // 3. Seed initial data for static page compilation
  console.log('🌱 Seeding default products and categories...')
  execSync('npx tsx scripts/seed.ts', { stdio: 'inherit', env: process.env })

  // 4. Next.js Build
  console.log('⚡ Building Next.js application...')
  execSync('npx next build', { stdio: 'inherit', env: process.env })

  console.log('✅ Production build completed successfully!')
} catch (error) {
  console.error('❌ Build failed:', error)
  process.exit(1)
}
