import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@vercel/kv'

function getKVClient() {
  const url = process.env.KV_REST_API_URL || process.env.hwiysignups_KV_REST_API_URL
  const token = process.env.KV_REST_API_TOKEN || process.env.hwiysignups_KV_REST_API_TOKEN
  if (!url || !token) return null
  return createClient({ url, token })
}

export async function POST(req: NextRequest) {
  let body: { contact?: string; war?: string; category?: string; type?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const contact = body.contact?.trim().toLowerCase()
  if (!contact || contact.length < 5) {
    return NextResponse.json({ error: 'Valid contact required' }, { status: 400 })
  }

  const id = `signup:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`
  const record = {
    contact,
    war: body.war || 'unknown',
    category: body.category || 'unknown',
    type: body.type || 'signup',
    timestamp: new Date().toISOString(),
    ts: Date.now(),
  }

  const kv = getKVClient()
  if (kv) {
    try {
      await kv.set(id, JSON.stringify(record))
      await kv.zadd('signups:all', { score: Date.now(), member: id })
      await kv.incr('signups:count')
    } catch (e) {
      console.warn('KV write error:', (e as Error).message)
    }
  }

  return NextResponse.json({ ok: true, message: 'Thank you for signing up.' })
}
