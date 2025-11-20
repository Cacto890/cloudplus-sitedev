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
    null
  )
}
