/**
 * /api/signup.js — Vercel Serverless Function
 * ─────────────────────────────────────────────────────────────────────────
 * Receives email/phone signups from the simulation gate and stores them
 * in Vercel KV (Redis). Each signup is stored with a timestamp and the
 * war/category context the user was viewing.
 *
 * Requires: Vercel KV store connected to the project
 * (Dashboard → Storage → Create KV → link to project)
 *
 * KV structure:
 *   Key:   signup:{timestamp}:{random}
 *   Value: { contact, war, category, timestamp, userAgent }
 *
 * Also maintains a sorted set "signups:all" for easy listing.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { contact, war, category } = req.body || {};

    if (!contact || typeof contact !== 'string' || contact.trim().length < 5) {
      return res.status(400).json({ error: 'Valid contact (email or phone) is required' });
    }

    const cleaned = contact.trim().toLowerCase();
    const now = Date.now();
    const id = `signup:${now}:${Math.random().toString(36).slice(2, 8)}`;

    const record = {
      contact: cleaned,
      war: war || 'unknown',
      category: category || 'unknown',
      timestamp: new Date(now).toISOString(),
      ts: now,
    };

    // Store individual record
    await kv.set(id, JSON.stringify(record));

    // Add to sorted set for easy listing (score = timestamp)
    await kv.zadd('signups:all', { score: now, member: id });

    // Track total count
    await kv.incr('signups:count');

    return res.status(200).json({ ok: true, message: 'Thank you for signing up.' });
  } catch (err) {
    console.error('Signup error:', err.message);
    // Don't block the user experience if KV fails — still return success
    return res.status(200).json({ ok: true, message: 'Thank you for signing up.', _kvError: err.message });
  }
}
