"use client"

import { useState } from "react"
import { Tiny5Button } from "@/components/ui/tiny5-button"
import Link from "next/link"
import { useMusicPlayer } from "@/components/music-player-provider"

interface DNSResult {
  domain: string
  ips: string[]
  error?: string
}

export default function NT03Page() {
  const { isAllRed } = useMusicPlayer()
  const [domain, setDomain] = useState("")
  const [result, setResult] = useState<DNSResult | null>(null)
  const [loading, setLoading] = useState(false)
  const textColor = isAllRed ? 'text-red-500' : 'text-white'

  const handleLookup = async () => {
    if (!domain.trim()) return
    setLoading(true)
    try {
      const response = await fetch(
        `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=A`
      )
      const data = await response.json()
      
      if (data.Answer) {
        const ips = data.Answer.map((record: any) => record.data).slice(0, 5)
        setResult({ domain, ips })
      } else {
        setResult({ domain, ips: [], error: "NO RECORDS FOUND" })
      }
    } catch (error) {
      console.error("[v0] DNS lookup error:", error)
      setResult({ domain, ips: [], error: "LOOKUP FAILED" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-black relative flex items-center justify-center p-4">
      <div className="absolute top-8 left-8 z-10">
        <Link href="/code">
          <Tiny5Button className={`${textColor} hover:text-red-500`}>BACK</Tiny5Button>
        </Link>
      </div>

      <div className="flex flex-col gap-8 items-center z-10 max-w-2xl w-full">
        <div className={`${textColor} opacity-50 text-2xl`} style={{ fontFamily: 'var(--font-tiny5)' }}>
          DNS LOOKUP
        </div>

        <div className="flex gap-2 w-full max-w-md">
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLookup()}
            placeholder="ENTER DOMAIN..."
            className={`flex-1 bg-transparent border-none ${textColor} px-4 py-2 focus:outline-none opacity-50 focus:opacity-100`}
            style={{ fontFamily: 'var(--font-tiny5)', borderBottom: `1px solid ${isAllRed ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.5)'}` }}
          />
          <Tiny5Button onClick={handleLookup} disabled={loading} className={`${textColor} hover:text-red-500`}>
            {loading ? "..." : "LOOKUP"}
          </Tiny5Button>
        </div>

        {result && (
          <div className={`w-full flex flex-col gap-3 p-6 border ${isAllRed ? 'border-red-500/30' : 'border-white/30'} max-w-md`} style={{ fontFamily: 'var(--font-tiny5)' }}>
            <div className={`${textColor} opacity-50 text-sm`}>
              {result.domain}
            </div>
            {result.error ? (
              <div className={`${textColor} opacity-50 text-sm`}>
                {result.error}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {result.ips.map((ip, idx) => (
                  <div key={idx} className={`flex items-center p-2 border-l-2 ${isAllRed ? 'border-red-500/50' : 'border-white/20'} pl-3`}>
                    <div className={`${textColor} opacity-75 text-sm`}>{ip}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className={`${textColor} opacity-30 text-sm mt-8`} style={{ fontFamily: 'var(--font-tiny5)' }}>
          CODE: NT-03
        </div>
      </div>
    </main>
  )
}
