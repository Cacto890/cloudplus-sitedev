"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Tiny5Button } from "@/components/ui/tiny5-button"
import { useMusicPlayer } from "@/components/music-player-provider"
import { isAdmin, getAllUsers, deleteUser, makeAdmin, logout } from "@/lib/auth"
import { useRouter } from "next/navigation"

export default function AdminPanel() {
  const { isAllRed } = useMusicPlayer()
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)
  const [users, setUsers] = useState<Array<{ username: string; isAdmin: boolean }>>([])
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    if (!isAdmin()) {
      router.push("/code")
    } else {
      setAuthorized(true)
      setUsers(getAllUsers())
    }
  }, [router, refresh])

  const handleDeleteUser = (username: string) => {
    if (confirm(`Are you sure you want to delete user "${username}"?`)) {
      const success = deleteUser(username)
      if (success) {
        setRefresh(refresh + 1)
      } else {
        alert("Cannot delete the main admin account")
      }
    }
  }

  const handleMakeAdmin = (username: string) => {
    if (confirm(`Make "${username}" an admin?`)) {
      const success = makeAdmin(username)
      if (success) {
        setRefresh(refresh + 1)
      } else {
        alert("Failed to make user admin")
      }
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/code")
  }

  if (!authorized) {
    return null
  }

  const textColor = isAllRed ? "text-red-500" : "text-white"

  return (
    <main className="min-h-screen bg-black relative">
      <div className="absolute top-8 left-8 z-10">
        <Link href="/code">
          <Tiny5Button className={`${textColor} hover:text-red-500`}>BACK</Tiny5Button>
        </Link>
      </div>

      <div className="absolute top-8 right-8 z-10">
        <Tiny5Button onClick={handleLogout} className={`${textColor} hover:text-red-500`}>
          LOGOUT
        </Tiny5Button>
      </div>

      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h1 className={`text-4xl mb-4 ${textColor}`} style={{ fontFamily: "var(--font-tiny5)" }}>
            ADMIN PANEL
          </h1>
          <p className={`${textColor} opacity-50`} style={{ fontFamily: "var(--font-tiny5)" }}>
            MANAGE ALL USERS
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className={`border border-white/10 ${textColor}`}>
            {/* Header */}
            <div className="grid grid-cols-4 gap-4 p-4 border-b border-white/10 bg-white/5">
              <div style={{ fontFamily: "var(--font-tiny5)" }}>USERNAME</div>
              <div style={{ fontFamily: "var(--font-tiny5)" }}>ROLE</div>
              <div style={{ fontFamily: "var(--font-tiny5)" }} className="col-span-2">
                ACTIONS
              </div>
            </div>

            {/* Users list */}
            {users.length === 0 ? (
              <div className="p-8 text-center opacity-50" style={{ fontFamily: "var(--font-tiny5)" }}>
                NO USERS FOUND
              </div>
            ) : (
              users.map((user) => (
                <div key={user.username} className="grid grid-cols-4 gap-4 p-4 border-b border-white/10 items-center">
                  <div style={{ fontFamily: "var(--font-tiny5)" }}>{user.username}</div>
                  <div style={{ fontFamily: "var(--font-tiny5)" }} className="opacity-50">
                    {user.isAdmin ? "ADMIN" : "USER"}
                  </div>
                  <div className="col-span-2 flex gap-2">
                    {!user.isAdmin && (
                      <Tiny5Button
                        onClick={() => handleMakeAdmin(user.username)}
                        className={`${textColor} hover:text-red-500 text-sm`}
                      >
                        MAKE ADMIN
                      </Tiny5Button>
                    )}
                    {user.username !== "Cacto" && (
                      <Tiny5Button
                        onClick={() => handleDeleteUser(user.username)}
                        className="text-red-500 hover:text-red-400 text-sm"
                      >
                        DELETE
                      </Tiny5Button>
                    )}
                    {user.username === "Cacto" && (
                      <span className="opacity-30 text-sm" style={{ fontFamily: "var(--font-tiny5)" }}>
                        PROTECTED
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div
            className={`mt-4 text-center opacity-50 text-sm ${textColor}`}
            style={{ fontFamily: "var(--font-tiny5)" }}
          >
            TOTAL USERS: {users.length}
          </div>
        </div>
      </div>
    </main>
  )
}
