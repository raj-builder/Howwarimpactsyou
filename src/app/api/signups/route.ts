import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@vercel/kv'

function getKVClient() {
  const url = process.env.KV_REST_API_URL || process.env.hwiysignups_KV_REST_API_URL
  const token = process.env.KV_REST_API_TOKEN || process.env.hwiysignups_KV_REST_API_TOKEN
  if (!url || !token) return null
  return createClient({ url, token })
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const secret = searchParams.get('secret')
  const adminSecret = process.env.ADMIN_SECRET || 'hwiy-admin-2025'

  if (secret !== adminSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const kv = getKVClient()
  if (!kv) {
    return NextResponse.json({ error: 'KV not configured' }, { status: 500 })
  }

  const count = await kv.get<number>('signups:count')
  const ids = await kv.zrange('signups:all', 0, 99, { rev: true })

  const signups = []
  for (const id of ids) {
    const raw = await kv.get<string>(id as string)
    if (raw) {
      try {
        signups.push(typeof raw === 'string' ? JSON.parse(raw) : raw)
      } catch {
        signups.push({ id, raw })
      }
    }
  }

  return NextResponse.json({ total: count, showing: signups.length, signups })
}
