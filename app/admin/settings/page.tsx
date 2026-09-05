import React from 'react'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getAdminFromCookie } from '@/lib/auth'
import SettingsManager from './SettingsManager'

export default async function AdminSettingsPage() {
  const admin = await getAdminFromCookie()
  if (!admin) redirect('/admin/login')

  const settingsRows = await prisma.siteSetting.findMany()
  const settings: Record<string, string> = {}
  settingsRows.forEach((s) => {
    settings[s.key] = s.value
  })

  return <SettingsManager initialSettings={settings} />
}
