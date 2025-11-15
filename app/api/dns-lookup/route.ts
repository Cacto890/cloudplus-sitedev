import { NextRequest, NextResponse } from 'next/server'
import { resolve } from 'dns/promises'

export async function POST(request: NextRequest) {
  try {
    const { domain } = await request.json()
    
    if (!domain) {
      return NextResponse.json({ error: 'INVALID DOMAIN' }, { status: 400 })
    }

    const ips = await resolve(domain)
    
    return NextResponse.json({
      domain,
      ips: ips.slice(0, 5) // Limit to 5 results
    })
  } catch (error) {
    console.error("[v0] DNS error:", error)
    return NextResponse.json({
      domain: '',
      ips: [],
      error: 'LOOKUP FAILED'
    }, { status: 500 })
  }
}
