import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const category = formData.get("category") as string
    const uploader = formData.get("uploader") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Upload to Vercel Blob with a unique path including category
    const timestamp = Date.now()
    const filename = `${category}/${timestamp}-${file.name}`

    const blob = await put(filename, file, {
      access: "public",
    })

    return NextResponse.json({
      url: blob.url,
      filename: file.name,
      pathname: blob.pathname,
      size: file.size,
      type: file.type,
      category,
      uploader,
      uploadedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
