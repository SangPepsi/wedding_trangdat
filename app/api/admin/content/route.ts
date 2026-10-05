import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { NextResponse } from 'next/server'
import { rejectIfNotAdmin } from '@/lib/admin-guard'
import { validateContent } from '@/lib/content'

export const dynamic = 'force-dynamic'

const CONTENT_FILE = join(process.cwd(), 'content', 'wedding.json')

export async function GET(request: Request) {
  const rejected = rejectIfNotAdmin(request)
  if (rejected) return rejected
  return NextResponse.json(JSON.parse(await readFile(CONTENT_FILE, 'utf8')))
}

export async function PUT(request: Request) {
  const rejected = rejectIfNotAdmin(request)
  if (rejected) return rejected

  let data: unknown
  try {
    data = await request.json()
  } catch {
    return NextResponse.json({ error: 'Dữ liệu gửi lên không phải JSON' }, { status: 400 })
  }
  const error = validateContent(data)
  if (error) return NextResponse.json({ error }, { status: 400 })

  await writeFile(CONTENT_FILE, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
  return NextResponse.json({ ok: true })
}
