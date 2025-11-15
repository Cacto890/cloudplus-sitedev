"use client"

import { useState } from "react"
import { Tiny5Button } from "@/components/ui/tiny5-button"
import Link from "next/link"
import { useMusicPlayer } from "@/components/music-player-provider"

export default function NT01Page() {
  const { isAllRed } = useMusicPlayer()
  const [inputText, setInputText] = useState("")
  const [analysis, setAnalysis] = useState<{ sentiment: string; wordCount: number; preview: string } | null>(null)
  const textColor = isAllRed ? 'text-red-500' : 'text-white'

  const analyzeText = () => {
    if (!inputText.trim()) return

    const words = inputText.trim().split(/\s+/)
    const hasPositive = /good|great|amazing|excellent|love|wonderful/i.test(inputText)
    const hasNegative = /bad|terrible|awful|hate|horrible|poor/i.test(inputText)
    const sentiment = hasPositive ? "POSITIVE" : hasNegative ? "NEGATIVE" : "NEUTRAL"

    setAnalysis({
      sentiment,
      wordCount: words.length,
      preview: inputText.substring(0, 50) + (inputText.length > 50 ? "..." : "")
    })
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
          NEURAL TEXT ANALYZER
        </div>

        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="ENTER TEXT HERE..."
          className={`w-full h-32 bg-transparent border ${isAllRed ? 'border-red-500/30' : 'border-white/30'} ${textColor} p-4 focus:outline-none opacity-50 focus:opacity-100 transition-opacity`}
          style={{ fontFamily: 'var(--font-tiny5)' }}
        />

        <Tiny5Button onClick={analyzeText} className={`${textColor} hover:text-red-500`}>
          ANALYZE
        </Tiny5Button>

        {analysis && (
          <div className={`w-full flex flex-col gap-4 p-4 border ${isAllRed ? 'border-red-500/50' : 'border-white/30'}`}>
            <div className={`${textColor} opacity-50`} style={{ fontFamily: 'var(--font-tiny5)' }}>
              ANALYSIS RESULTS
            </div>
            <div className={`${textColor} opacity-75`} style={{ fontFamily: 'var(--font-tiny5)' }}>
              SENTIMENT: {analysis.sentiment}
            </div>
            <div className={`${textColor} opacity-75`} style={{ fontFamily: 'var(--font-tiny5)' }}>
              WORD COUNT: {analysis.wordCount}
            </div>
            <div className={`${textColor} opacity-50`} style={{ fontFamily: 'var(--font-tiny5)' }}>
              PREVIEW: {analysis.preview}
            </div>
          </div>
        )}

        <div className={`${textColor} opacity-30 text-sm mt-8`} style={{ fontFamily: 'var(--font-tiny5)' }}>
          CODE: NT-01
        </div>
      </div>
    </main>
  )
}
