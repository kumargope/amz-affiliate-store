const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// 1. Resolve DATABASE_URL
let dbUrl = process.env.DATABASE_URL || 'file:./dev.db'

// On Vercel, copy SQLite file to writable /tmp directory if using file storage
if (process.env.VERCEL && dbUrl.startsWith('file:')) {
  try {
    const tmpDbPath = '/tmp/dev.db'
    const bundledDbPath = path.join(process.cwd(), 'prisma', 'dev.db')
    if (!fs.existsSync(tmpDbPath) && fs.existsSync(bundledDbPath)) {
      fs.mkdirSync(path.dirname(tmpDbPath), { recursive: true })
      fs.copyFileSync(bundledDbPath, tmpDbPath)
    }
    dbUrl = `file:${tmpDbPath}`
    process.env.DATABASE_URL = dbUrl
  } catch (e) {
    console.error('Failed to setup /tmp/dev.db on Vercel:', e)
  }
}

console.log('🚀 Running production build with DATABASE_URL:', dbUrl)

// 2. Dynamically set provider in schema.prisma to match DATABASE_URL type
const isPostgres = dbUrl.startsWith('postgres://') || dbUrl.startsWith('postgresql://')
const targetProvider = isPostgres ? 'postgresql' : 'sqlite'

const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma')
if (fs.existsSync(schemaPath)) {
  try {
    let schema = fs.readFileSync(schemaPath, 'utf8')
    const currentProviderMatch = schema.match(/provider\s*=\s*"(sqlite|postgresql)"/)
    if (currentProviderMatch && currentProviderMatch[1] !== targetProvider) {
      console.log(`🔄 Auto-switching Prisma schema provider to '${targetProvider}'...`)
      schema = schema.replace(/provider\s*=\s*"(sqlite|postgresql)"/, `provider = "${targetProvider}"`)
      fs.writeFileSync(schemaPath, schema, 'utf8')
    }
  } catch (e) {
    console.warn('Could not update schema provider:', e)
  }
}

try {
  // 3. Prisma Generate
  console.log('📦 Generating Prisma Client...')
  execSync('npx prisma generate', { stdio: 'inherit', env: process.env })

  // 4. Prisma DB Push (create tables if SQLite)
  console.log('🗄️ Syncing Database Schema...')
  try {
    execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit', env: process.env })
  } catch (dbErr) {
    console.warn('⚠️ Warning: DB Push skipped or encountered error (continuing build):', dbErr.message)
  }

  // 5. Seed initial data for static page compilation
  console.log('🌱 Seeding default products and categories...')
  try {
    execSync('npx tsx scripts/seed.ts', { stdio: 'inherit', env: process.env })
  } catch (seedErr) {
    console.warn('⚠️ Warning: Seeding skipped or encountered error (continuing build):', seedErr.message)
  }

  // 6. Next.js Build
  console.log('⚡ Building Next.js application...')
  execSync('npx next build', { stdio: 'inherit', env: process.env })

  console.log('✅ Production build completed successfully!')
} catch (error) {
  console.error('❌ Build failed:', error)
  process.exit(1)
}
