"use client"

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react"

const playlist = [
  { file: '/CANUBE.wav', title: 'CAN U BE', artist: 'Kanye West' },
  { file: '/MARGIELA.mp3', title: 'margiela', artist: 'Ken Carson' },
  { file: '/ALLRED.mp3', title: 'ALL RED', artist: 'Playboi Carti' },
]

interface MusicPlayerContextType {
  isPlaying: boolean
  currentTrackIndex: number
  currentTrack: { file: string; title: string; artist: string }
  isAllRed: boolean
  togglePlayPause: () => void
  skipTrack: () => void
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined)

export function MusicPlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [hasUserInteracted, setHasUserInteracted] = useState(false)

  const currentTrack = playlist[currentTrackIndex]
  const isAllRed = currentTrack.title === 'ALL RED' && isPlaying

  useEffect(() => {
    const audio = new Audio(currentTrack.file)
    audio.volume = 1
    audioRef.current = audio

    const handleEnded = () => {
      setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % playlist.length)
      setIsPlaying(true)
    }

    audio.addEventListener('ended', handleEnded)

    if (hasUserInteracted && isPlaying) {
      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((error) => {
            console.error('Error playing audio:', error)
            setIsPlaying(false)
          })
      }
    }

    return () => {
      audio.removeEventListener('ended', handleEnded)
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [currentTrackIndex, currentTrack.file, hasUserInteracted, isPlaying])

  const togglePlayPause = () => {
    if (!hasUserInteracted) {
      setHasUserInteracted(true)
    }
    
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch((error) => {
            console.error('Error playing audio:', error)
            setIsPlaying(false)
          })
      }
    }
  }

  const skipTrack = () => {
    if (!hasUserInteracted) {
      setHasUserInteracted(true)
    }
    const nextIndex = (currentTrackIndex + 1) % playlist.length
    setCurrentTrackIndex(nextIndex)
    setIsPlaying(true)
  }

  return (
    <MusicPlayerContext.Provider
      value={{
        isPlaying,
        currentTrackIndex,
        currentTrack,
        isAllRed,
        togglePlayPause,
        skipTrack,
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  )
}

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext)
  if (context === undefined) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider')
  }
  return context
}
