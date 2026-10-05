import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { AdminEditor } from '@/components/admin/admin-editor'
import { isAdminAllowed } from '@/lib/admin-guard'
import type { WeddingContent } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Quản trị thiệp cưới',
  robots: { index: false, follow: false },
}

export default async function AdminPage() {
  if (process.env.NODE_ENV !== 'development') notFound()
  if (!isAdminAllowed((await headers()).get('host'))) notFound()

  const content: WeddingContent = JSON.parse(await readFile(join(process.cwd(), 'content', 'wedding.json'), 'utf8'))
  return <AdminEditor initial={content} />
}
