import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

function prepareWritableDatabase() {
  if (process.env.VERCEL) {
    try {
      const tmpDbPath = '/tmp/dev.db'
      const bundledDbPath = path.join(process.cwd(), 'prisma', 'dev.db')

      if (!fs.existsSync(tmpDbPath)) {
        if (fs.existsSync(bundledDbPath)) {
          fs.mkdirSync(path.dirname(tmpDbPath), { recursive: true })
          fs.copyFileSync(bundledDbPath, tmpDbPath)
        }
      }
      process.env.DATABASE_URL = `file:${tmpDbPath}`
    } catch (err) {
      console.error('Failed to prepare writable database in /tmp:', err)
    }
  }
}

prepareWritableDatabase()

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
