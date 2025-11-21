"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated } from "@/lib/auth"
import { Tiny5Button } from "@/components/ui/tiny5-button"
import Link from "next/link"
import { useMusicPlayer } from "@/components/music-player-provider"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isAllRed } = useMusicPlayer()
  const [isAuth, setIsAuth] = useState<boolean | null>(null)

  const textColor = isAllRed ? "text-red-500" : "text-white"

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated()
      setIsAuth(authenticated)
    }

    checkAuth()
  }, [router])

  if (isAuth === null) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className={`${textColor} opacity-50`} style={{ fontFamily: "var(--font-tiny5)" }}>
          LOADING...
        </div>
      </div>
    )
  }

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col gap-8 items-center">
          <div className={`${textColor} opacity-50 text-xl`} style={{ fontFamily: "var(--font-tiny5)" }}>
            AUTHENTICATION REQUIRED
          </div>
          <div className={`${textColor} opacity-50 text-sm`} style={{ fontFamily: "var(--font-tiny5)" }}>
            THIS PAGE REQUIRES LOGIN
          </div>
          <div className="flex gap-4">
            <Link href="/code/lg-01">
              <Tiny5Button className={`${textColor} hover:text-red-500`}>LOGIN</Tiny5Button>
            </Link>
            <Link href="/code/su-01">
              <Tiny5Button className={`${textColor} hover:text-red-500`}>SIGNUP</Tiny5Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
