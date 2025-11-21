import { list } from "@vercel/blob"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const { blobs } = await list()

    const files = blobs.map((blob) => {
      const pathParts = blob.pathname.split("/")
      const category = pathParts.length > 1 ? pathParts[0] : "uncategorized"
      const filename = pathParts.pop() || "unknown"

      // Extract original filename (remove timestamp prefix)
      const originalFilename = filename.includes("-") ? filename.substring(filename.indexOf("-") + 1) : filename

      return {
        url: blob.url,
        pathname: blob.pathname,
        filename: originalFilename,
        size: blob.size,
        uploadedAt: blob.uploadedAt,
        category,
      }
    })

    return NextResponse.json({ files })
  } catch (error) {
    console.error("[v0] Error listing files:", error)
    return NextResponse.json({ error: "Failed to list files" }, { status: 500 })
  }
}
