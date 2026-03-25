import { NextResponse } from 'next/server'
import { COUNTRIES } from '@/data/countries'

export async function GET() {
  return NextResponse.json(
    {
      version: '1.0',
      updated: '2025-03-25',
      license: 'CC BY 4.0',
      count: COUNTRIES.length,
      data: COUNTRIES,
    },
    {
      headers: {
        'Cache-Control': 's-maxage=86400',
        'Access-Control-Allow-Origin': '*',
      },
    }
  )
}
