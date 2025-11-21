"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Tiny5Button } from "@/components/ui/tiny5-button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMusicPlayer } from "@/components/music-player-provider"
import { login, getCurrentUser, logout } from "@/lib/auth"

export default function LoginPage() {
  const { isAllRed } = useMusicPlayer()
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<{ username: string; loggedIn: boolean } | null>(null)
  const [isChecking, setIsChecking] = useState(true)

  const textColor = isAllRed ? "text-red-500" : "text-white"
  const borderColor = isAllRed ? "rgba(239, 68, 68, 0.5)" : "rgba(255, 255, 255, 0.5)"

  useEffect(() => {
    const user = getCurrentUser()
    setCurrentUser(user)
    setIsChecking(false)
  }, [])

  const handleLogout = () => {
    logout()
    setCurrentUser(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (!username.trim() || !password.trim()) {
      setError("ALL FIELDS REQUIRED")
      setLoading(false)
      return
    }

    const success = login(username.trim(), password)

    if (success) {
      setCurrentUser(getCurrentUser())
    } else {
      setError("INVALID CREDENTIALS")
    }

    setLoading(false)
  }

  if (isChecking) {
    return (
      <main className="min-h-screen bg-black relative flex items-center justify-center">
        <div className={`${textColor} opacity-50`} style={{ fontFamily: "var(--font-tiny5)" }}>
          LOADING...
        </div>
      </main>
    )
  }

  if (currentUser?.loggedIn) {
    return (
      <main className="min-h-screen bg-black relative flex items-center justify-center">
        <div className="absolute top-8 left-8 z-10">
          <Link href="/code">
            <Tiny5Button className={`${textColor} hover:text-red-500`}>BACK</Tiny5Button>
          </Link>
        </div>

        <div className="flex flex-col gap-8 items-center z-10 max-w-md w-full px-4">
          <div className={`${textColor} opacity-50 text-2xl`} style={{ fontFamily: "var(--font-tiny5)" }}>
            ACCOUNT
          </div>

          <div className={`${textColor} opacity-70 text-lg text-center`} style={{ fontFamily: "var(--font-tiny5)" }}>
            LOGGED IN AS: {currentUser.username.toUpperCase()}
          </div>

          <div className="flex flex-col gap-4 w-full mt-4">
            <Tiny5Button onClick={handleLogout} className={`${textColor} hover:text-red-500 w-full`}>
              LOGOUT
            </Tiny5Button>

            <div
              className={`${textColor} opacity-40 text-xs text-center mt-4`}
              style={{ fontFamily: "var(--font-tiny5)" }}
            >
              ACCESS TO PROTECTED FEATURES ENABLED
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black relative flex items-center justify-center">
      <div className="absolute top-8 left-8 z-10">
        <Link href="/code">
          <Tiny5Button className={`${textColor} hover:text-red-500`}>BACK</Tiny5Button>
        </Link>
      </div>

      <div className="flex flex-col gap-8 items-center z-10 max-w-md w-full px-4">
        <div className={`${textColor} opacity-50 text-2xl`} style={{ fontFamily: "var(--font-tiny5)" }}>
          LOGIN
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
          <div className="flex flex-col gap-2">
            <label className={`${textColor} opacity-50 text-sm`} style={{ fontFamily: "var(--font-tiny5)" }}>
              USERNAME
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username..."
              className={`bg-transparent border-none ${textColor} px-4 py-2 focus:outline-none transition-opacity opacity-50 focus:opacity-100`}
              style={{ fontFamily: "var(--font-tiny5)", borderBottom: `1px solid ${borderColor}` }}
              maxLength={50}
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className={`${textColor} opacity-50 text-sm`} style={{ fontFamily: "var(--font-tiny5)" }}>
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password..."
              className={`bg-transparent border-none ${textColor} px-4 py-2 focus:outline-none transition-opacity opacity-50 focus:opacity-100`}
              style={{ fontFamily: "var(--font-tiny5)", borderBottom: `1px solid ${borderColor}` }}
              maxLength={100}
            />
          </div>

          {error && (
            <div className="text-red-500 opacity-50 text-sm text-center" style={{ fontFamily: "var(--font-tiny5)" }}>
              {error}
            </div>
          )}

          <Tiny5Button type="submit" disabled={loading} className={`${textColor} hover:text-red-500 w-full`}>
            {loading ? "LOGGING IN..." : "LOGIN"}
          </Tiny5Button>

          <div
            className={`${textColor} opacity-50 text-sm text-center mt-4`}
            style={{ fontFamily: "var(--font-tiny5)" }}
          >
            DON'T HAVE AN ACCOUNT?{" "}
            <Link href="/code/su-01" className="hover:opacity-100 transition-opacity underline">
              SIGNUP
            </Link>
          </div>
        </form>
      </div>
    </main>
  )
}
