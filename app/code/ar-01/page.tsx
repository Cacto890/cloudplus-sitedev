"use client"

import { useState, useRef } from "react"
import { Tiny5Button } from "@/components/ui/tiny5-button"
import Link from "next/link"
import { useMusicPlayer } from "@/components/music-player-provider"

export default function AR01Page() {
  const { isAllRed } = useMusicPlayer()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState(isAllRed ? '#ef4444' : '#ffffff')
  const textColor = isAllRed ? 'text-red-500' : 'text-white'

  const startDrawing = (e: React.MouseEvent) => {
    if (!canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    setIsDrawing(true)
    ctx.beginPath()
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
  }

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing || !canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    if (!canvasRef.current) return
    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
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
          AR CANVAS
        </div>

        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className={`border-2 ${isAllRed ? 'border-red-500/50' : 'border-white/30'} bg-black cursor-crosshair`}
        />

        <div className="flex gap-4">
          <Tiny5Button onClick={clearCanvas} className={`${textColor} hover:text-red-500`}>
            CLEAR
          </Tiny5Button>
          <button
            onClick={() => setColor(isAllRed ? '#ef4444' : '#ffffff')}
            className={`px-4 py-2 border ${isAllRed ? 'border-red-500/50' : 'border-white/30'} ${textColor} hover:text-red-500 transition-colors`}
            style={{ fontFamily: 'var(--font-tiny5)' }}
          >
            TOGGLE COLOR
          </button>
        </div>

        <div className={`${textColor} opacity-30 text-sm mt-8`} style={{ fontFamily: 'var(--font-tiny5)' }}>
          CODE: AR-01
        </div>
      </div>
    </main>
  )
}
