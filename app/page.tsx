"use client"

import AsciiHero from "@/components/ascii-hero"
import { Tiny5Button } from "@/components/ui/tiny5-button"
import Link from "next/link"
import { useMusicPlayer } from "@/components/music-player-provider"

export default function Home() {
  const { isPlaying, isAllRed, togglePlayPause, skipTrack, currentTrack } = useMusicPlayer()

  const textColor = isAllRed ? '#ef4444' : 'white'

  return (
    <main className="min-h-screen relative">
      <AsciiHero isRed={isAllRed} />
      <div className="absolute top-8 right-8 z-10">
        <Link href="/code">
          <Tiny5Button className={isAllRed ? "text-red-500 hover:text-red-500" : "text-white hover:text-red-500"}>CODE</Tiny5Button>
        </Link>
      </div>
      <div className="absolute top-8 left-8 z-10 flex flex-col gap-4">
        <div className="opacity-50 text-base" style={{ fontFamily: 'var(--font-tiny5)', color: textColor }}>
          NOW PLAYING
        </div>
        <div className="opacity-50 hover:opacity-100 transition-opacity" style={{ fontFamily: 'var(--font-tiny5)', color: textColor }}>
          {currentTrack.title} - {currentTrack.artist}
        </div>
        <div className="flex gap-4">
          <Tiny5Button 
            onClick={togglePlayPause}
            className={isAllRed ? "text-red-500 hover:text-red-500" : "text-white hover:text-red-500"}
          >
            {isPlaying ? 'PAUSE' : 'PLAY'}
          </Tiny5Button>
          <Tiny5Button 
            onClick={skipTrack}
            className={isAllRed ? "text-red-500 hover:text-red-500" : "text-white hover:text-red-500"}
          >
            SKIP
          </Tiny5Button>
        </div>
      </div>
    </main>
  )
}
