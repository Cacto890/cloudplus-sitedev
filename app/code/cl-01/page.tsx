"use client"

import { useState } from "react"
import { Tiny5Button } from "@/components/ui/tiny5-button"
import Link from "next/link"
import { useMusicPlayer } from "@/components/music-player-provider"

export default function CL01Page() {
  const { isAllRed } = useMusicPlayer()
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [mode, setMode] = useState<"encode" | "decode">("encode")
  const [error, setError] = useState("")
  const textColor = isAllRed ? 'text-red-500' : 'text-white'
  const borderColor = isAllRed ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.5)'

  const handleEncode = () => {
    setError("")
    setOutput("")
    
    if (!input.trim()) {
      setError("INPUT REQUIRED")
      return
    }

    try {
      const encoded = btoa(input)
      setOutput(encoded)
      setMode("encode")
    } catch (e) {
      setError("ENCODING FAILED: " + (e as Error).message)
    }
  }

  const handleDecode = () => {
    setError("")
    setOutput("")
    
    if (!input.trim()) {
      setError("INPUT REQUIRED")
      return
    }

    try {
      const decoded = atob(input)
      setOutput(decoded)
      setMode("decode")
    } catch (e) {
      setError("DECODING FAILED: INVALID BASE64")
    }
  }

  const handleClear = () => {
    setInput("")
    setOutput("")
    setError("")
  }

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output)
    }
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
          BASE64 ENCODER/DECODER
        </div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex flex-col gap-3">
            <div className={`${textColor} opacity-50 text-sm`} style={{ fontFamily: 'var(--font-tiny5)' }}>
              INPUT
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text to encode or Base64 to decode..."
              className={`bg-transparent border ${textColor} p-4 focus:outline-none opacity-50 focus:opacity-100 font-mono text-sm min-h-[400px] resize-y`}
              style={{ borderColor }}
            />
            <div className="flex gap-3 flex-wrap">
              <Tiny5Button onClick={handleEncode} className={`${textColor} hover:text-red-500`}>
                ENCODE
              </Tiny5Button>
              <Tiny5Button onClick={handleDecode} className={`${textColor} hover:text-red-500`}>
                DECODE
              </Tiny5Button>
              <Tiny5Button onClick={handleClear} className={`${textColor} hover:text-red-500`}>
                CLEAR
              </Tiny5Button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className={`${textColor} opacity-50 text-sm`} style={{ fontFamily: 'var(--font-tiny5)' }}>
              OUTPUT
            </div>
            <textarea
              value={output}
              readOnly
              placeholder="Result will appear here..."
              className={`bg-transparent border ${textColor} p-4 focus:outline-none opacity-50 font-mono text-sm min-h-[400px] resize-y`}
              style={{ borderColor }}
            />
            {output && (
              <Tiny5Button onClick={handleCopy} className={`${textColor} hover:text-red-500`}>
                COPY TO CLIPBOARD
              </Tiny5Button>
            )}
          </div>
        </div>

        {error && (
          <div className="text-red-500 opacity-75 text-sm" style={{ fontFamily: 'var(--font-tiny5)' }}>
            {error}
          </div>
        )}

        <div className={`${textColor} opacity-30 text-sm mt-8`} style={{ fontFamily: 'var(--font-tiny5)' }}>
          CODE: CL-01
        </div>
      </div>
    </main>
  )
}
