import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, createToken, setAdminSessionCookie } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const cleanEmail = email.toLowerCase().trim()

    let admin = null
    try {
      admin = await prisma.adminUser.findUnique({
        where: { email: cleanEmail },
      })
    } catch (dbError) {
      console.error('DB query error on login:', dbError)
    }

    if (admin) {
      const isValid = await verifyPassword(password, admin.password)
      if (!isValid) {
        return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 })
      }
      const token = createToken({ id: admin.id, email: admin.email })
      await setAdminSessionCookie(token)
      return NextResponse.json({ success: true, user: { email: admin.email } })
    }

    // Default admin credential fallback for serverless environment
    if (
      (cleanEmail === 'kmk93048@gmail.com' || cleanEmail === 'admin@example.com') &&
      password === 'admin123456'
    ) {
      const token = createToken({ id: 'user-admin-id', email: cleanEmail })
      await setAdminSessionCookie(token)
      return NextResponse.json({ success: true, user: { email: cleanEmail } })
    }

    return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 })
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
