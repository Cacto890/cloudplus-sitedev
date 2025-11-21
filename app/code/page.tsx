"use client"

import type React from "react"

import { useState } from "react"
import { Tiny5Button } from "@/components/ui/tiny5-button"
import Link from "next/link"
import { useMusicPlayer } from "@/components/music-player-provider"

const projects: Record<string, { title: string; description: string; route?: string }> = {
  "1300": {
    title: "Weather App",
    description: "Real-time weather data powered by OpenMeteo",
    route: "/code/1300",
  },
  "CT-01": {
    title: "CACTO",
    description: "A prickly friend with social connections",
    route: "/code/ct-01",
  },
  "NT-01": {
    title: "Neural Text Analyzer",
    description: "Analyze text sentiment and metrics",
    route: "/code/nt-01",
  },
  "NT-02": {
    title: "What is My IP",
    description: "Discover your public IP address instantly",
    route: "/code/nt-02",
  },
  "NT-03": {
    title: "DNS Lookup",
    description: "Find IP addresses connected to domains",
    route: "/code/nt-03",
  },
  "PL-01": {
    title: "JSON Formatter",
    description: "Format and validate JSON with ease",
    route: "/code/pl-01",
  },
  "CL-01": {
    title: "Base64 Encoder/Decoder",
    description: "Encode and decode Base64 strings",
    route: "/code/cl-01",
  },
  "CL-02": {
    title: "Hash Generator",
    description: "Generate SHA-256, SHA-512, and more",
    route: "/code/cl-02",
  },
  "AR-01": {
    title: "AR Canvas",
    description: "Free-form drawing and creative tool",
    route: "/code/ar-01",
  },
  "DR-01": {
    title: "Drawing App",
    description: "Advanced drawing with brushes and colors",
    route: "/code/dr-01",
  },
  "LG-01": {
    title: "Login",
    description: "Access your account",
    route: "/code/lg-01",
  },
  "SU-01": {
    title: "Signup",
    description: "Create a new account",
    route: "/code/su-01",
  },
  "ALL-01": {
    title: "Admin Dashboard",
    description: "View all available codes and projects",
    route: "/code/all-01",
  },
  "AP-01": {
    title: "Admin Panel",
    description: "Manage users and admin privileges",
    route: "/code/ap-01",
  },
  "FH-01": {
    title: "File Hosting",
    description: "Secure file storage and management",
    route: "/code/fh-01",
  },
  "24918": {
    title: "Project Alpha",
    description: "A cutting-edge development project",
  },
  "12345": {
    title: "Project Beta",
    description: "Innovative solutions for modern challenges",
  },
  "54321": {
    title: "Project Gamma",
    description: "Next-generation technology platform",
  },
}

export default function CodePage() {
  const { isAllRed } = useMusicPlayer()
  const [code, setCode] = useState("")
  const [enteredCode, setEnteredCode] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!code.trim()) {
      setError("Please enter a code")
      return
    }

    setEnteredCode(code.trim())

    if (!projects[code.trim()]) {
      setError("Invalid code")
    }
  }

  const currentProject = enteredCode ? projects[enteredCode] : null
  const textColor = isAllRed ? "text-red-500" : "text-white"
  const borderColor = isAllRed ? "rgba(239, 68, 68, 0.5)" : "rgba(255, 255, 255, 0.5)"

  return (
    <main className="min-h-screen bg-black relative flex items-center justify-center">
      <div className="absolute top-8 left-8 z-10">
        <Link href="/">
          <Tiny5Button className={`${textColor} hover:text-red-500`}>BACK</Tiny5Button>
        </Link>
      </div>

      <div className="flex flex-col gap-8 items-center z-10">
        <div className={`${textColor} opacity-50`} style={{ fontFamily: "var(--font-tiny5)" }}>
          ENTER CODE
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter code..."
            className={`bg-transparent border-none ${textColor} px-4 py-2 focus:outline-none transition-opacity opacity-50 focus:opacity-100`}
            style={{ fontFamily: "var(--font-tiny5)", borderBottom: `1px solid ${borderColor}` }}
            maxLength={20}
            autoFocus
          />

          <Tiny5Button type="submit" className={`${textColor} hover:text-red-500`}>
            SUBMIT
          </Tiny5Button>
        </form>

        {error && (
          <div className="text-red-500 opacity-50" style={{ fontFamily: "var(--font-tiny5)" }}>
            {error}
          </div>
        )}

        {currentProject && !error && (
          <div className="flex flex-col gap-4 items-center mt-8">
            <div className={`${textColor} opacity-50`} style={{ fontFamily: "var(--font-tiny5)" }}>
              PROJECT FOUND
            </div>
            <div
              className={`${textColor} opacity-50 hover:opacity-100 transition-opacity`}
              style={{ fontFamily: "var(--font-tiny5)" }}
            >
              {currentProject.title}
            </div>
            <div className={`${textColor} opacity-50`} style={{ fontFamily: "var(--font-tiny5)" }}>
              {currentProject.description}
            </div>
            {currentProject.route && (
              <Link href={currentProject.route}>
                <Tiny5Button className={`${textColor} hover:text-red-500 mt-4`}>VISIT PROJECT</Tiny5Button>
              </Link>
            )}
          </div>
        )}

        {enteredCode && !currentProject && !error && (
          <div className={`${textColor} opacity-50`} style={{ fontFamily: "var(--font-tiny5)" }}>
            CODE: {enteredCode}
          </div>
        )}
      </div>
    </main>
  )
}
