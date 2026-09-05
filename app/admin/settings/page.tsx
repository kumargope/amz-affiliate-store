import React from 'react'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getAdminFromCookie } from '@/lib/auth'
import SettingsManager from './SettingsManager'

export default async function AdminSettingsPage() {
  const admin = await getAdminFromCookie()
  if (!admin) redirect('/admin/login')

  const settings: Record<string, string> = {}

  try {
    const settingsRows = await prisma.siteSetting.findMany()
    settingsRows.forEach((s) => {
      settings[s.key] = s.value
    })
  } catch (error) {
    console.error('Error fetching settings for admin settings page:', error)
  }

  return <SettingsManager initialSettings={settings} />
}
