"use client"

import { Tiny5Button } from "@/components/ui/tiny5-button"
import Link from "next/link"
import { useMusicPlayer } from "@/components/music-player-provider"

const CACTO_ASCII = `




░█████╗░░█████╗░░█████╗░████████╗░█████╗░
██╔══██╗██╔══██╗██╔══██╗╚══██╔══╝██╔══██╗
██║░░╚═╝███████║██║░░╚═╝░░░██║░░░██║░░██║
██║░░██╗██╔══██║██║░░██╗░░░██║░░░██║░░██║
╚█████╔╝██║░░██║╚█████╔╝░░░██║░░░╚█████╔╝
░╚════╝░╚═╝░░╚═╝░╚════╝░░░░╚═╝░░░░╚════╝░



`

export default function CactoPage() {
  const { isAllRed } = useMusicPlayer()
  const textColor = isAllRed ? 'text-red-500' : 'text-white'

  return (
    <main className="min-h-screen bg-black relative flex items-center justify-center p-4">
      <div className="absolute top-8 left-8 z-10">
        <Link href="/code">
          <Tiny5Button className={`${textColor} hover:text-red-500`}>BACK</Tiny5Button>
        </Link>
      </div>

      <div className="flex flex-col gap-8 items-center z-10 max-w-4xl w-full">
        <div className={`${textColor} opacity-50 text-xl`} style={{ fontFamily: 'var(--font-tiny5)' }}>
          WELCOME TO CACTO
        </div>

        {/* ASCII art container */}
        <div
          className={`${textColor} opacity-75 overflow-x-auto whitespace-pre font-mono leading-tight max-h-96 overflow-y-auto text-2xl leading-7`}
          style={{
            fontFamily: 'var(--font-tiny5), monospace',
            fontSize: '6px',
            lineHeight: '1',
            letterSpacing: '0',
          }}
        >
          {CACTO_ASCII}
        </div>

        <div className="flex gap-8 items-center mt-8">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`${textColor} hover:text-red-500 transition-colors opacity-50 hover:opacity-100`}
            style={{ fontFamily: 'var(--font-tiny5)' }}
          >
            INSTAGRAM
          </a>
          <div className={`${textColor} opacity-30`}>|</div>
          <a
            href="https://discord.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`${textColor} hover:text-red-500 transition-colors opacity-50 hover:opacity-100`}
            style={{ fontFamily: 'var(--font-tiny5)' }}
          >
            DISCORD
          </a>
        </div>

        <div className={`${textColor} opacity-30 text-sm mt-4`} style={{ fontFamily: 'var(--font-tiny5)' }}>
          CODE: CT-01
        </div>
      </div>
    </main>
  )
}
