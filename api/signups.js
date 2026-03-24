/**
 * /api/signups.js — Vercel Serverless Function
 * ─────────────────────────────────────────────────────────────────────────
 * Lists all collected signups from Vercel KV.
 * Protected by a simple secret query parameter.
 *
 * Usage: GET /api/signups?secret=YOUR_ADMIN_SECRET
 *
 * Set ADMIN_SECRET as an environment variable in Vercel dashboard.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Simple auth check
  const secret = req.query.secret;
  const adminSecret = process.env.ADMIN_SECRET || 'hwiy-admin-2025';

  if (secret !== adminSecret) {
    return res.status(401).json({ error: 'Unauthorized. Provide ?secret=YOUR_ADMIN_SECRET' });
  }

  try {
    // Get total count
    const count = (await kv.get('signups:count')) || 0;

    // Get recent signups (latest 100)
    const limit = parseInt(req.query.limit) || 100;
    const ids = await kv.zrange('signups:all', 0, limit - 1, { rev: true });

    const signups = [];
    for (const id of ids) {
      const raw = await kv.get(id);
      if (raw) {
        try {
          signups.push(typeof raw === 'string' ? JSON.parse(raw) : raw);
        } catch {
          signups.push({ raw, id });
        }
      }
    }

    return res.status(200).json({
      total: count,
      showing: signups.length,
      signups,
    });
  } catch (err) {
    console.error('Signups list error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch signups', detail: err.message });
  }
}
