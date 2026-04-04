import { NextResponse } from 'next/server'
import { createClient } from '@vercel/kv'

function getKVClient() {
  const url = process.env.KV_REST_API_URL || process.env.hwiysignups_KV_REST_API_URL
  const token = process.env.KV_REST_API_TOKEN || process.env.hwiysignups_KV_REST_API_TOKEN
  if (!url || !token) return null
  return createClient({ url, token })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, socialHandle, socialPlatform, message, sourceUrl } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      )
    }

    const id = `feedback:${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    const record = {
      id,
      name,
      email,
      socialHandle: socialHandle || null,
      socialPlatform: socialPlatform || null,
      message,
      sourceUrl: sourceUrl || null,
      submittedAt: new Date().toISOString(),
      status: 'pending', // pending → reviewed → incorporated → rejected
    }

    const kv = getKVClient()
    if (kv) {
      try {
        await kv.set(id, JSON.stringify(record))
        await kv.zadd('feedback:all', { score: Date.now(), member: id })
        await kv.incr('feedback:count')
      } catch (e) {
        console.warn('[feedback] KV write error:', (e as Error).message)
      }
    } else {
      // Fallback: log to console when KV is not configured
      console.log('[feedback] KV not configured — logging to console:', JSON.stringify(record))
    }

    return NextResponse.json({ ok: true, id })
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }
}
