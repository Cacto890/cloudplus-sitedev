"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Tiny5Button } from "@/components/ui/tiny5-button"
import { useMusicPlayer } from "@/components/music-player-provider"
import { isAdmin, logout } from "@/lib/auth"
import { useRouter } from "next/navigation"

const allProjects = [
  { code: "1300", title: "Weather App", route: "/code/1300" },
  { code: "CT-01", title: "CACTO", route: "/code/ct-01" },
  { code: "NT-01", title: "Neural Text Analyzer", route: "/code/nt-01" },
  { code: "NT-02", title: "What is My IP", route: "/code/nt-02" },
  { code: "NT-03", title: "DNS Lookup", route: "/code/nt-03" },
  { code: "PL-01", title: "JSON Formatter", route: "/code/pl-01" },
  { code: "CL-01", title: "Base64 Encoder/Decoder", route: "/code/cl-01" },
  { code: "CL-02", title: "Hash Generator", route: "/code/cl-02" },
  { code: "AR-01", title: "AR Canvas", route: "/code/ar-01" },
  { code: "DR-01", title: "Drawing App", route: "/code/dr-01" },
  { code: "LG-01", title: "Login", route: "/code/lg-01" },
  { code: "SU-01", title: "Signup", route: "/code/su-01" },
  { code: "ALL-01", title: "Admin Dashboard", route: "/code/all-01" },
  { code: "AP-01", title: "Admin Panel", route: "/code/ap-01" },
  { code: "FH-01", title: "File Hosting", route: "/code/fh-01" },
]

export default function AdminDashboard() {
  const { isAllRed } = useMusicPlayer()
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    if (!isAdmin()) {
      router.push("/code")
    } else {
      setAuthorized(true)
    }
  }, [router])

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
            ADMIN DASHBOARD
          </h1>
          <p className={`${textColor} opacity-50`} style={{ fontFamily: "var(--font-tiny5)" }}>
            ALL AVAILABLE CODES
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {allProjects.map((project) => (
            <Link key={project.code} href={project.route}>
              <div
                className={`border border-white/10 p-6 hover:border-red-500/50 transition-all ${textColor} hover:text-red-500 cursor-pointer`}
              >
                <div className="text-2xl mb-2" style={{ fontFamily: "var(--font-tiny5)" }}>
                  {project.code}
                </div>
                <div className="opacity-50" style={{ fontFamily: "var(--font-tiny5)" }}>
                  {project.title}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
