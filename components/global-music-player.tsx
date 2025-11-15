"use client"

import { useMusicPlayer } from "./music-player-provider"
import { Tiny5Button } from "./ui/tiny5-button"
import { usePathname } from 'next/navigation'

export function GlobalMusicPlayer() {
  const { isPlaying, currentTrack, isAllRed, togglePlayPause, skipTrack } = useMusicPlayer()
  const pathname = usePathname()
  
  if (pathname === '/') {
    return null
  }
  
  const textColor = isAllRed ? '#ef4444' : 'white'

  return (
    <div className="fixed top-8 left-8 z-50 flex gap-4 pointer-events-auto flex-col mx-20 items-stretch justify-start tracking-normal" style={{ width: 'fit-content' }}>
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
  )
}
