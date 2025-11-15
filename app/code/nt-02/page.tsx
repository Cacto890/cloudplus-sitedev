"use client"

import { useState, useEffect } from "react"
import { Tiny5Button } from "@/components/ui/tiny5-button"
import Link from "next/link"
import { useMusicPlayer } from "@/components/music-player-provider"

export default function NT02Page() {
  const { isAllRed } = useMusicPlayer()
  const [ip, setIp] = useState<string>("LOADING...")
  const [loading, setLoading] = useState(true)
  const textColor = isAllRed ? 'text-red-500' : 'text-white'

  useEffect(() => {
    const fetchIP = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json")
        const data = await response.json()
        setIp(data.ip || "UNKNOWN")
      } catch (error) {
        console.error("[v0] Error fetching IP:", error)
        setIp("ERROR")
      } finally {
        setLoading(false)
      }
    }
    fetchIP()
  }, [])

  return (
    <main className="min-h-screen bg-black relative flex items-center justify-center p-4">
      <div className="absolute top-8 left-8 z-10">
        <Link href="/code">
          <Tiny5Button className={`${textColor} hover:text-red-500`}>BACK</Tiny5Button>
        </Link>
      </div>

      <div className="flex flex-col gap-8 items-center z-10 max-w-2xl w-full">
        <div className={`${textColor} opacity-50 text-2xl`} style={{ fontFamily: 'var(--font-tiny5)' }}>
          WHAT IS MY IP
        </div>

        <div className={`w-full flex flex-col gap-4 p-8 border ${isAllRed ? 'border-red-500/30' : 'border-white/30'}`} style={{ fontFamily: 'var(--font-tiny5)' }}>
          <div className={`${textColor} opacity-50 text-sm`}>
            YOUR PUBLIC IP ADDRESS
          </div>
          <div className={`${textColor} text-3xl font-bold ${loading ? 'opacity-50' : 'opacity-100'}`}>
            {ip}
          </div>
          <div className={`${textColor} opacity-30 text-xs`}>
            {loading ? "FETCHING..." : "READY"}
          </div>
        </div>

        <div className={`${textColor} opacity-30 text-sm mt-8`} style={{ fontFamily: 'var(--font-tiny5)' }}>
          CODE: NT-02
        </div>
      </div>
    </main>
  )
}
