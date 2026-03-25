import { NextResponse } from 'next/server'
import { WARS } from '@/data/wars'

export async function GET() {
  return NextResponse.json(
    {
      version: '1.0',
      updated: '2025-03-25',
      license: 'CC BY 4.0',
      data: WARS,
    },
    {
      headers: {
        'Cache-Control': 's-maxage=86400',
        'Access-Control-Allow-Origin': '*',
      },
    }
  )
}
