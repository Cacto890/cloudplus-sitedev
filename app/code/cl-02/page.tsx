"use client"

import { useState } from "react"
import { Tiny5Button } from "@/components/ui/tiny5-button"
import Link from "next/link"
import { useMusicPlayer } from "@/components/music-player-provider"

export default function CL02Page() {
  const { isAllRed } = useMusicPlayer()
  const [input, setInput] = useState("")
  const [hashes, setHashes] = useState<Record<string, string>>({})
  const [error, setError] = useState("")
  const textColor = isAllRed ? 'text-red-500' : 'text-white'
  const borderColor = isAllRed ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.5)'

  const handleGenerate = async () => {
    setError("")
    setHashes({})
    
    if (!input.trim()) {
      setError("INPUT REQUIRED")
      return
    }

    try {
      const encoder = new TextEncoder()
      const data = encoder.encode(input)
      
      const results: Record<string, string> = {}

      // SHA-256
      const sha256Buffer = await crypto.subtle.digest('SHA-256', data)
      results['SHA-256'] = Array.from(new Uint8Array(sha256Buffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')

      // SHA-384
      const sha384Buffer = await crypto.subtle.digest('SHA-384', data)
      results['SHA-384'] = Array.from(new Uint8Array(sha384Buffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')

      // SHA-512
      const sha512Buffer = await crypto.subtle.digest('SHA-512', data)
      results['SHA-512'] = Array.from(new Uint8Array(sha512Buffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')

      // SHA-1
      const sha1Buffer = await crypto.subtle.digest('SHA-1', data)
      results['SHA-1'] = Array.from(new Uint8Array(sha1Buffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')

      setHashes(results)
    } catch (e) {
      setError("HASH GENERATION FAILED: " + (e as Error).message)
    }
  }

  const handleClear = () => {
    setInput("")
    setHashes({})
    setError("")
  }

  const handleCopy = (hash: string) => {
    navigator.clipboard.writeText(hash)
  }

  return (
    <main className="min-h-screen bg-black relative flex items-center justify-center p-4">
      <div className="absolute top-8 left-8 z-10">
        <Link href="/code">
          <Tiny5Button className={`${textColor} hover:text-red-500`}>BACK</Tiny5Button>
        </Link>
      </div>

      <div className="flex flex-col gap-8 items-center z-10 max-w-7xl w-full">
        <div className={`${textColor} opacity-50 text-2xl`} style={{ fontFamily: 'var(--font-tiny5)' }}>
          HASH GENERATOR
        </div>

        <div className="w-full max-w-3xl flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <div className={`${textColor} opacity-50 text-sm`} style={{ fontFamily: 'var(--font-tiny5)' }}>
              INPUT TEXT
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text to hash..."
              className={`bg-transparent border ${textColor} p-4 focus:outline-none opacity-50 focus:opacity-100 font-mono text-sm min-h-[200px] resize-y`}
              style={{ borderColor }}
            />
            <div className="flex gap-3">
              <Tiny5Button onClick={handleGenerate} className={`${textColor} hover:text-red-500`}>
                GENERATE HASHES
              </Tiny5Button>
              <Tiny5Button onClick={handleClear} className={`${textColor} hover:text-red-500`}>
                CLEAR
              </Tiny5Button>
            </div>
          </div>

          {Object.keys(hashes).length > 0 && (
            <div className="flex flex-col gap-4">
              <div className={`${textColor} opacity-50 text-sm`} style={{ fontFamily: 'var(--font-tiny5)' }}>
                RESULTS
              </div>
              {Object.entries(hashes).map(([algorithm, hash]) => (
                <div key={algorithm} className="flex flex-col gap-2">
                  <div className={`${textColor} opacity-75 text-xs`} style={{ fontFamily: 'var(--font-tiny5)' }}>
                    {algorithm}
                  </div>
                  <div className="flex gap-2 items-center">
                    <div 
                      className={`bg-transparent border ${textColor} p-3 opacity-50 font-mono text-xs break-all flex-1`}
                      style={{ borderColor }}
                    >
                      {hash}
                    </div>
                    <Tiny5Button 
                      onClick={() => handleCopy(hash)} 
                      className={`${textColor} hover:text-red-500 text-xs`}
                    >
                      COPY
                    </Tiny5Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="text-red-500 opacity-75 text-sm" style={{ fontFamily: 'var(--font-tiny5)' }}>
              {error}
            </div>
          )}
        </div>

        <div className={`${textColor} opacity-30 text-sm mt-8`} style={{ fontFamily: 'var(--font-tiny5)' }}>
          CODE: CL-02
        </div>
      </div>
    </main>
  )
}
