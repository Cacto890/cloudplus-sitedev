"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { isAdmin, getCurrentUser } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { Tiny5Button } from "@/components/ui/tiny5-button"
import { Upload, Trash2, FolderOpen, ImageIcon, Video, File } from "lucide-react"

interface FileData {
  url: string
  pathname: string
  filename: string
  size: number
  uploadedAt: string
  category: string
  type?: string
}

const CATEGORIES = ["images", "videos", "documents", "other"]

export default function FileHostingPage() {
  const router = useRouter()
  const [files, setFiles] = useState<FileData[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [uploadCategory, setUploadCategory] = useState<string>("images")
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    if (!isAdmin()) {
      router.push("/code")
      return
    }
    loadFiles()
  }, [router])

  const loadFiles = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/files/list")
      const data = await response.json()

      if (data.files) {
        setFiles(data.files)
      }
    } catch (error) {
      console.error("[v0] Error loading files:", error)
      showMessage("error", "Failed to load files")
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const currentUser = getCurrentUser()
    if (!currentUser) return

    setUploading(true)
    showMessage("success", "Uploading...")

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("category", uploadCategory)
      formData.append("uploader", currentUser.username)

      const response = await fetch("/api/files/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        showMessage("success", "File uploaded successfully!")
        await loadFiles()
      } else {
        showMessage("error", data.error || "Upload failed")
      }
    } catch (error) {
      console.error("[v0] Upload error:", error)
      showMessage("error", "Upload failed")
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  const handleDelete = async (fileUrl: string) => {
    if (!confirm("Are you sure you want to delete this file?")) return

    try {
      const response = await fetch("/api/files/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: fileUrl }),
      })

      if (response.ok) {
        showMessage("success", "File deleted successfully!")
        await loadFiles()
      } else {
        showMessage("error", "Delete failed")
      }
    } catch (error) {
      console.error("[v0] Delete error:", error)
      showMessage("error", "Delete failed")
    }
  }

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  const getFileIcon = (filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase()
    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext || "")) {
      return <ImageIcon className="w-8 h-8" />
    }
    if (["mp4", "avi", "mov", "webm"].includes(ext || "")) {
      return <Video className="w-8 h-8" />
    }
    if (["pdf", "doc", "docx", "txt"].includes(ext || "")) {
      return <File className="w-8 h-8" />
    }
    return <File className="w-8 h-8" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB"
    return (bytes / (1024 * 1024)).toFixed(2) + " MB"
  }

  const filteredFiles = selectedCategory === "all" ? files : files.filter((f) => f.category === selectedCategory)

  const categoryCounts = CATEGORIES.reduce(
    (acc, cat) => {
      acc[cat] = files.filter((f) => f.category === cat).length
      return acc
    },
    {} as Record<string, number>,
  )

  if (!isAdmin()) {
    return null
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl mb-2" style={{ fontFamily: "var(--font-tiny5)" }}>
              FILE HOSTING
            </h1>
            <p className="text-white/50" style={{ fontFamily: "var(--font-tiny5)" }}>
              Admin-only file management platform
            </p>
          </div>
          <Tiny5Button onClick={() => router.push("/code")} className="text-white hover:text-red-500">
            BACK
          </Tiny5Button>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-4 p-4 border ${
              message.type === "success" ? "border-green-500 text-green-500" : "border-red-500 text-red-500"
            }`}
            style={{ fontFamily: "var(--font-tiny5)" }}
          >
            {message.text}
          </div>
        )}

        {/* Upload Section */}
        <div className="border border-white/20 p-6 mb-8">
          <h2 className="text-2xl mb-4" style={{ fontFamily: "var(--font-tiny5)" }}>
            <Upload className="inline-block mr-2 w-6 h-6" />
            UPLOAD FILE
          </h2>

          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-white/50 mb-2" style={{ fontFamily: "var(--font-tiny5)" }}>
                CATEGORY
              </label>
              <select
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value)}
                className="w-full bg-black border border-white/20 text-white p-2"
                style={{ fontFamily: "var(--font-tiny5)" }}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-white/50 mb-2" style={{ fontFamily: "var(--font-tiny5)" }}>
                SELECT FILE
              </label>
              <input
                type="file"
                onChange={handleFileUpload}
                disabled={uploading}
                className="w-full bg-black border border-white/20 text-white p-2"
                style={{ fontFamily: "var(--font-tiny5)" }}
              />
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <Tiny5Button
            onClick={() => setSelectedCategory("all")}
            className={selectedCategory === "all" ? "text-red-500" : "text-white hover:text-red-500"}
          >
            ALL ({files.length})
          </Tiny5Button>
          {CATEGORIES.map((cat) => (
            <Tiny5Button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={selectedCategory === cat ? "text-red-500" : "text-white hover:text-red-500"}
            >
              <FolderOpen className="inline-block mr-1 w-4 h-4" />
              {cat.toUpperCase()} ({categoryCounts[cat] || 0})
            </Tiny5Button>
          ))}
        </div>

        {/* Files Grid */}
        {loading ? (
          <div className="text-center text-white/50 py-12" style={{ fontFamily: "var(--font-tiny5)" }}>
            LOADING FILES...
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="text-center text-white/50 py-12" style={{ fontFamily: "var(--font-tiny5)" }}>
            NO FILES IN THIS CATEGORY
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFiles.map((file) => (
              <div key={file.url} className="border border-white/20 p-4 hover:border-red-500/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="text-red-500">{getFileIcon(file.filename)}</div>
                  <button
                    onClick={() => handleDelete(file.url)}
                    className="text-white/50 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <h3
                  className="text-white mb-2 truncate"
                  style={{ fontFamily: "var(--font-tiny5)" }}
                  title={file.filename}
                >
                  {file.filename}
                </h3>

                <div className="space-y-1 text-white/50 text-sm" style={{ fontFamily: "var(--font-tiny5)" }}>
                  <div>SIZE: {formatFileSize(file.size)}</div>
                  <div>CATEGORY: {file.category.toUpperCase()}</div>
                  <div>UPLOADED: {new Date(file.uploadedAt).toLocaleDateString()}</div>
                </div>

                <a href={file.url} target="_blank" rel="noopener noreferrer" className="block mt-3">
                  <Tiny5Button className="w-full text-white hover:text-red-500">VIEW FILE</Tiny5Button>
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
