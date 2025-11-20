"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Tiny5Button } from "@/components/ui/tiny5-button"
import { useMusicPlayer } from "@/components/music-player-provider"
import {
  Upload,
  Download,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Settings,
  Move,
  Undo,
  Redo,
  X,
  Smartphone,
  ZoomIn,
  ZoomOut,
  GripVertical,
} from "lucide-react"

type Tool = "brush" | "eraser" | "select" | "shape" | "text" | "move" | "delete" | "zoom"
type BrushType = "pen" | "marker" | "spray" | "calligraphy" | "pencil" | "airbrush"
type ShapeType = "rectangle" | "circle" | "line" | "triangle"

type Layer = {
  id: string
  name: string
  visible: boolean
  opacity: number
  canvas: HTMLCanvasElement
  type: "drawing" | "background" | "image" | "text"
}

type ImageObject = {
  id: string
  img: HTMLImageElement
  x: number
  y: number
  width: number
  height: number
  rotation: number
  layerId: string
}

type TextObject = {
  id: string
  text: string
  x: number
  y: number
  fontSize: number
  fontFamily: string
  color: string
  rotation: number
  layerId: string
}

type Effect = "blur" | "grayscale" | "sepia" | "invert" | "brightness" | "contrast" | "pixelate"

type HistoryState = {
  layers: Layer[]
  images: ImageObject[]
  textObjects: TextObject[]
}

export default function DR01Page() {
  const { isAllRed } = useMusicPlayer()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const backgroundInputRef = useRef<HTMLInputElement>(null)

  const [isMobile, setIsMobile] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState("#ef4444")
  const [backgroundColor, setBackgroundColor] = useState("#1a1a1a")
  const [tool, setTool] = useState<Tool>("brush")
  const [brushType, setBrushType] = useState<BrushType>("pen")
  const [brushSize, setBrushSize] = useState(5)
  const [opacity, setOpacity] = useState(100)
  const [layers, setLayers] = useState<Layer[]>([])
  const [activeLayerId, setActiveLayerId] = useState<string>("")
  const [canvasWidth, setCanvasWidth] = useState(800)
  const [canvasHeight, setCanvasHeight] = useState(600)
  const [showSizeDialog, setShowSizeDialog] = useState(false)
  const [tempWidth, setTempWidth] = useState(800)
  const [tempHeight, setTempHeight] = useState(600)
  const [activeEffect, setActiveEffect] = useState<Effect | null>(null)
  const [shapeType, setShapeType] = useState<ShapeType>("rectangle")
  const [shapeStart, setShapeStart] = useState<{ x: number; y: number } | null>(null)
  const [textInput, setTextInput] = useState("")
  const [textPosition, setTextPosition] = useState<{ x: number; y: number } | null>(null)
  const [fontSize, setFontSize] = useState(24)
  const [fontFamily, setFontFamily] = useState("Arial")

  const [images, setImages] = useState<ImageObject[]>([])
  const [textObjects, setTextObjects] = useState<TextObject[]>([])
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null)
  const [selectedObjectType, setSelectedObjectType] = useState<"image" | "text" | null>(null)
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(null)
  const [resizing, setResizing] = useState(false)
  const [rotating, setRotating] = useState(false)

  const [editingTextId, setEditingTextId] = useState<string | null>(null)
  const [editingTextValue, setEditingTextValue] = useState("")
  const [editingFontSize, setEditingFontSize] = useState(24)
  const [editingFontFamily, setEditingFontFamily] = useState("Arial")
  const [editingTextColor, setEditingTextColor] = useState("#ef4444")

  const [history, setHistory] = useState<HistoryState[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  const [zoom, setZoom] = useState(100)
  const [draggedLayerId, setDraggedLayerId] = useState<string | null>(null)
  const [dragOverLayerId, setDragOverLayerId] = useState<string | null>(null)

  const textColor = isAllRed ? "text-red-500" : "text-white"
  const borderColor = isAllRed ? "border-red-500/50" : "border-white/30"
  const bgColor = isAllRed ? "bg-red-500/10" : "bg-white/5"

  const fonts = ["Arial", "Courier New", "Georgia", "Times New Roman", "Verdana", "Comic Sans MS"]

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    const initialLayer = createNewLayer("Background", "drawing")
    setLayers([initialLayer])
    setActiveLayerId(initialLayer.id)
  }, [])

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d")
    if (!ctx) return

    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)

    layers.forEach((layer) => {
      if (layer.visible) {
        ctx.globalAlpha = layer.opacity / 100
        ctx.drawImage(layer.canvas, 0, 0)

        // Draw images for this layer
        images
          .filter((img) => img.layerId === layer.id)
          .forEach((imgObj) => {
            ctx.save()
            ctx.translate(imgObj.x + imgObj.width / 2, imgObj.y + imgObj.height / 2)
            ctx.rotate((imgObj.rotation * Math.PI) / 180)
            ctx.drawImage(imgObj.img, -imgObj.width / 2, -imgObj.height / 2, imgObj.width, imgObj.height)
            ctx.restore()

            if (selectedObjectId === imgObj.id && selectedObjectType === "image") {
              ctx.save()
              ctx.translate(imgObj.x + imgObj.width / 2, imgObj.y + imgObj.height / 2)
              ctx.rotate((imgObj.rotation * Math.PI) / 180)
              ctx.strokeStyle = "#ef4444"
              ctx.lineWidth = 2
              ctx.setLineDash([5, 5])
              ctx.strokeRect(-imgObj.width / 2, -imgObj.height / 2, imgObj.width, imgObj.height)
              ctx.setLineDash([])

              // Resize handle
              const handleSize = 8
              ctx.fillStyle = "#ef4444"
              ctx.fillRect(
                imgObj.width / 2 - handleSize / 2,
                imgObj.height / 2 - handleSize / 2,
                handleSize,
                handleSize,
              )

              // Rotation handle
              ctx.beginPath()
              ctx.arc(0, -imgObj.height / 2 - 20, 6, 0, Math.PI * 2)
              ctx.fill()
              ctx.restore()
            }
          })

        // Draw text for this layer
        textObjects
          .filter((txt) => txt.layerId === layer.id)
          .forEach((txtObj) => {
            ctx.save()
            ctx.translate(txtObj.x, txtObj.y)
            ctx.rotate((txtObj.rotation * Math.PI) / 180)
            ctx.fillStyle = txtObj.color
            ctx.font = `${txtObj.fontSize}px ${txtObj.fontFamily}`
            ctx.fillText(txtObj.text, 0, 0)

            if (selectedObjectId === txtObj.id && selectedObjectType === "text") {
              const metrics = ctx.measureText(txtObj.text)
              const textWidth = metrics.width
              const textHeight = txtObj.fontSize

              ctx.strokeStyle = "#ef4444"
              ctx.lineWidth = 2
              ctx.setLineDash([5, 5])
              ctx.strokeRect(-5, -textHeight, textWidth + 10, textHeight + 10)
              ctx.setLineDash([])

              // Resize handle
              const handleSize = 8
              ctx.fillStyle = "#ef4444"
              ctx.fillRect(textWidth + 5 - handleSize / 2, 5 - handleSize / 2, handleSize, handleSize)

              // Rotation handle
              ctx.beginPath()
              ctx.arc(textWidth / 2, -textHeight - 20, 6, 0, Math.PI * 2)
              ctx.fill()
            }
            ctx.restore()
          })
      }
    })
    ctx.globalAlpha = 1

    if (activeEffect) {
      applyEffect(ctx, activeEffect)
    }
  }, [
    layers,
    canvasWidth,
    canvasHeight,
    activeEffect,
    images,
    textObjects,
    selectedObjectId,
    selectedObjectType,
    backgroundColor,
  ])

  const saveToHistory = () => {
    const currentState: HistoryState = {
      layers: layers.map((l) => ({
        ...l,
        canvas: cloneCanvas(l.canvas),
      })),
      images: [...images],
      textObjects: [...textObjects],
    }

    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(currentState)

    // Limit history to 50 states
    if (newHistory.length > 50) {
      newHistory.shift()
    } else {
      setHistoryIndex(historyIndex + 1)
    }

    setHistory(newHistory)
  }

  const cloneCanvas = (canvas: HTMLCanvasElement): HTMLCanvasElement => {
    const clone = document.createElement("canvas")
    clone.width = canvas.width
    clone.height = canvas.height
    const ctx = clone.getContext("2d")
    if (ctx) {
      ctx.drawImage(canvas, 0, 0)
    }
    return clone
  }

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      const state = history[newIndex]
      setLayers(
        state.layers.map((l) => ({
          ...l,
          canvas: cloneCanvas(l.canvas),
        })),
      )
      setImages([...state.images])
      setTextObjects([...state.textObjects])
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      const state = history[newIndex]
      setLayers(
        state.layers.map((l) => ({
          ...l,
          canvas: cloneCanvas(l.canvas),
        })),
      )
      setImages([...state.images])
      setTextObjects([...state.textObjects])
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault()
        undo()
      } else if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        e.preventDefault()
        redo()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [historyIndex, history])

  const createNewLayer = (name: string, type: "drawing" | "background" | "image" | "text" = "drawing"): Layer => {
    const canvas = document.createElement("canvas")
    canvas.width = canvasWidth
    canvas.height = canvasHeight
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    }
    return {
      id: `layer-${Date.now()}-${Math.random()}`,
      name,
      visible: true,
      opacity: 100,
      canvas,
      type,
    }
  }

  const addLayer = () => {
    const newLayer = createNewLayer(`Layer ${layers.length + 1}`, "drawing")
    setLayers([...layers, newLayer])
    setActiveLayerId(newLayer.id)
    saveToHistory()
  }

  const deleteLayer = (id: string) => {
    if (layers.length === 1) return
    const newLayers = layers.filter((l) => l.id !== id)
    setLayers(newLayers)
    setImages(images.filter((img) => img.layerId !== id))
    setTextObjects(textObjects.filter((txt) => txt.layerId !== id))
    if (activeLayerId === id) {
      setActiveLayerId(newLayers[0]?.id || "")
    }
    saveToHistory()
  }

  const toggleLayerVisibility = (id: string) => {
    setLayers(layers.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l)))
  }

  const updateLayerOpacity = (id: string, opacity: number) => {
    setLayers(layers.map((l) => (l.id === id ? { ...l, opacity } : l)))
  }

  const applyEffect = (ctx: CanvasRenderingContext2D, effect: Effect) => {
    const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight)
    const data = imageData.data

    switch (effect) {
      case "grayscale":
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
          data[i] = data[i + 1] = data[i + 2] = avg
        }
        break
      case "invert":
        for (let i = 0; i < data.length; i += 4) {
          data[i] = 255 - data[i]
          data[i + 1] = 255 - data[i + 1]
          data[i + 2] = 255 - data[i + 2]
        }
        break
      case "sepia":
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i],
            g = data[i + 1],
            b = data[i + 2]
          data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189)
          data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168)
          data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131)
        }
        break
      case "brightness":
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, data[i] + 50)
          data[i + 1] = Math.min(255, data[i + 1] + 50)
          data[i + 2] = Math.min(255, data[i + 2] + 50)
        }
        break
      case "contrast":
        const factor = 1.5
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128))
          data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128))
          data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128))
        }
        break
      case "pixelate":
        const pixelSize = 8
        for (let y = 0; y < canvasHeight; y += pixelSize) {
          for (let x = 0; x < canvasWidth; x += pixelSize) {
            const idx = (y * canvasWidth + x) * 4
            const r = data[idx]
            const g = data[idx + 1]
            const b = data[idx + 2]
            const a = data[idx + 3]

            for (let py = 0; py < pixelSize && y + py < canvasHeight; py++) {
              for (let px = 0; px < pixelSize && x + px < canvasWidth; px++) {
                const pidx = ((y + py) * canvasWidth + (x + px)) * 4
                data[pidx] = r
                data[pidx + 1] = g
                data[pidx + 2] = b
                data[pidx + 3] = a
              }
            }
          }
        }
        break
    }

    ctx.putImageData(imageData, 0, 0)
  }

  const getCanvasCoords = (e: React.MouseEvent): { x: number; y: number } => {
    if (!canvasRef.current) return { x: 0, y: 0 }
    const rect = canvasRef.current.getBoundingClientRect()
    return {
      x: (e.clientX - rect.left) * (canvasWidth / rect.width),
      y: (e.clientY - rect.top) * (canvasHeight / rect.height),
    }
  }

  const startDrawing = (e: React.MouseEvent) => {
    const coords = getCanvasCoords(e)

    if (tool === "delete") {
      // Check text objects first
      for (let i = textObjects.length - 1; i >= 0; i--) {
        const txt = textObjects[i]
        const ctx = document.createElement("canvas").getContext("2d")
        if (!ctx) continue
        ctx.font = `${txt.fontSize}px ${txt.fontFamily}`
        const metrics = ctx.measureText(txt.text)
        const textWidth = metrics.width
        const textHeight = txt.fontSize

        const dx = coords.x - txt.x
        const dy = coords.y - txt.y
        const angle = (-txt.rotation * Math.PI) / 180
        const localX = dx * Math.cos(angle) - dy * Math.sin(angle)
        const localY = dx * Math.sin(angle) + dy * Math.cos(angle)

        if (localX >= -5 && localX <= textWidth + 5 && localY >= -textHeight && localY <= 10) {
          setTextObjects(textObjects.filter((t) => t.id !== txt.id))
          saveToHistory()
          return
        }
      }

      // Check images
      for (let i = images.length - 1; i >= 0; i--) {
        const img = images[i]
        const centerX = img.x + img.width / 2
        const centerY = img.y + img.height / 2
        const dx = coords.x - centerX
        const dy = coords.y - centerY
        const angle = (-img.rotation * Math.PI) / 180
        const localX = dx * Math.cos(angle) - dy * Math.sin(angle)
        const localY = dx * Math.sin(angle) + dy * Math.cos(angle)

        if (Math.abs(localX) <= img.width / 2 && Math.abs(localY) <= img.height / 2) {
          setImages(images.filter((im) => im.id !== img.id))
          saveToHistory()
          return
        }
      }
      return
    }

    if (tool === "move") {
      if (selectedObjectId && selectedObjectType === "text") {
        const txt = textObjects.find((t) => t.id === selectedObjectId)
        if (txt) {
          const ctx = document.createElement("canvas").getContext("2d")
          if (!ctx) return
          ctx.font = `${txt.fontSize}px ${txt.fontFamily}`
          const metrics = ctx.measureText(txt.text)
          const textWidth = metrics.width
          const textHeight = txt.fontSize

          const dx = coords.x - txt.x
          const dy = coords.y - txt.y
          const angle = (-txt.rotation * Math.PI) / 180
          const localX = dx * Math.cos(angle) - dy * Math.sin(angle)
          const localY = dx * Math.sin(angle) + dy * Math.cos(angle)

          if (localX >= -5 && localX <= textWidth + 5 && localY >= -textHeight && localY <= 10) {
            setEditingTextId(txt.id)
            setEditingTextValue(txt.text)
            setEditingFontSize(txt.fontSize)
            setEditingFontFamily(txt.fontFamily)
            setEditingTextColor(txt.color)
            return
          }
        }
      }

      // Check text objects first (top priority)
      for (let i = textObjects.length - 1; i >= 0; i--) {
        const txt = textObjects[i]
        const ctx = document.createElement("canvas").getContext("2d")
        if (!ctx) continue
        ctx.font = `${txt.fontSize}px ${txt.fontFamily}`
        const metrics = ctx.measureText(txt.text)
        const textWidth = metrics.width
        const textHeight = txt.fontSize

        // Transform coordinates to account for rotation
        const dx = coords.x - txt.x
        const dy = coords.y - txt.y
        const angle = (-txt.rotation * Math.PI) / 180
        const localX = dx * Math.cos(angle) - dy * Math.sin(angle)
        const localY = dx * Math.sin(angle) + dy * Math.cos(angle)

        // Check rotation handle
        const rotHandleDist = Math.sqrt(Math.pow(localX - textWidth / 2, 2) + Math.pow(localY + textHeight + 20, 2))
        if (rotHandleDist < 10) {
          setSelectedObjectId(txt.id)
          setSelectedObjectType("text")
          setRotating(true)
          setIsDrawing(true)
          return
        }

        // Check resize handle
        if (localX >= textWidth - 5 && localX <= textWidth + 15 && localY >= -5 && localY <= 15) {
          setSelectedObjectId(txt.id)
          setSelectedObjectType("text")
          setResizing(true)
          setIsDrawing(true)
          return
        }

        // Check if clicking on text
        if (localX >= -5 && localX <= textWidth + 5 && localY >= -textHeight && localY <= 10) {
          setSelectedObjectId(txt.id)
          setSelectedObjectType("text")
          setDragOffset({ x: dx, y: dy })
          setIsDrawing(true)
          return
        }
      }

      // Check images
      for (let i = images.length - 1; i >= 0; i--) {
        const img = images[i]
        const centerX = img.x + img.width / 2
        const centerY = img.y + img.height / 2
        const dx = coords.x - centerX
        const dy = coords.y - centerY
        const angle = (-img.rotation * Math.PI) / 180
        const localX = dx * Math.cos(angle) - dy * Math.sin(angle)
        const localY = dx * Math.sin(angle) + dy * Math.cos(angle)

        // Check rotation handle
        const rotHandleDist = Math.sqrt(Math.pow(localX, 2) + Math.pow(localY + img.height / 2 + 20, 2))
        if (rotHandleDist < 10) {
          setSelectedObjectId(img.id)
          setSelectedObjectType("image")
          setRotating(true)
          setIsDrawing(true)
          return
        }

        // Check resize handle
        const handleSize = 8
        if (Math.abs(localX - img.width / 2) < handleSize && Math.abs(localY - img.height / 2) < handleSize) {
          setSelectedObjectId(img.id)
          setSelectedObjectType("image")
          setResizing(true)
          setIsDrawing(true)
          return
        }

        // Check if clicking on image
        if (Math.abs(localX) <= img.width / 2 && Math.abs(localY) <= img.height / 2) {
          setSelectedObjectId(img.id)
          setSelectedObjectType("image")
          setDragOffset({ x: coords.x - img.x, y: coords.y - img.y })
          setIsDrawing(true)
          return
        }
      }

      setSelectedObjectId(null)
      setSelectedObjectType(null)
      return
    }

    if (tool === "text") {
      setTextPosition(coords)
      return
    }

    if (tool === "shape") {
      setShapeStart(coords)
      setIsDrawing(true)
      return
    }

    const activeLayer = layers.find((l) => l.id === activeLayerId)
    if (!activeLayer || !canvasRef.current) return

    const ctx = activeLayer.canvas.getContext("2d")
    if (!ctx) return

    setIsDrawing(true)

    ctx.beginPath()
    ctx.moveTo(coords.x, coords.y)

    if (tool === "brush" && brushType === "spray") {
      drawSpray(ctx, coords.x, coords.y)
    } else if (tool === "brush" && brushType === "airbrush") {
      drawAirbrush(ctx, coords.x, coords.y)
    }
  }

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing || !canvasRef.current) return
    const coords = getCanvasCoords(e)

    if (tool === "move" && selectedObjectId && selectedObjectType) {
      if (rotating) {
        if (selectedObjectType === "image") {
          const img = images.find((i) => i.id === selectedObjectId)
          if (img) {
            const centerX = img.x + img.width / 2
            const centerY = img.y + img.height / 2
            const angle = (Math.atan2(coords.y - centerY, coords.x - centerX) * 180) / Math.PI + 90
            setImages(images.map((i) => (i.id === selectedObjectId ? { ...i, rotation: angle } : i)))
          }
        } else if (selectedObjectType === "text") {
          const txt = textObjects.find((t) => t.id === selectedObjectId)
          if (txt) {
            const angle = (Math.atan2(coords.y - txt.y, coords.x - txt.x) * 180) / Math.PI + 90
            setTextObjects(textObjects.map((t) => (t.id === selectedObjectId ? { ...t, rotation: angle } : t)))
          }
        }
      } else if (resizing) {
        if (selectedObjectType === "image") {
          const img = images.find((i) => i.id === selectedObjectId)
          if (img) {
            const centerX = img.x + img.width / 2
            const centerY = img.y + img.height / 2
            const dx = coords.x - centerX
            const dy = coords.y - centerY
            const angle = (-img.rotation * Math.PI) / 180
            const localX = dx * Math.cos(angle) - dy * Math.sin(angle)
            const localY = dx * Math.sin(angle) + dy * Math.cos(angle)
            const newWidth = Math.max(20, localX * 2)
            const newHeight = Math.max(20, localY * 2)
            setImages(
              images.map((i) =>
                i.id === selectedObjectId
                  ? { ...i, width: newWidth, height: newHeight, x: centerX - newWidth / 2, y: centerY - newHeight / 2 }
                  : i,
              ),
            )
          }
        } else if (selectedObjectType === "text") {
          const txt = textObjects.find((t) => t.id === selectedObjectId)
          if (txt) {
            const newSize = Math.max(12, Math.abs(coords.x - txt.x) / 5)
            setTextObjects(textObjects.map((t) => (t.id === selectedObjectId ? { ...t, fontSize: newSize } : t)))
          }
        }
      } else if (dragOffset) {
        if (selectedObjectType === "image") {
          setImages(
            images.map((i) =>
              i.id === selectedObjectId ? { ...i, x: coords.x - dragOffset.x, y: coords.y - dragOffset.y } : i,
            ),
          )
        } else if (selectedObjectType === "text") {
          setTextObjects(
            textObjects.map((t) =>
              t.id === selectedObjectId ? { ...t, x: coords.x - dragOffset.x, y: coords.y - dragOffset.y } : t,
            ),
          )
        }
      }
      return
    }

    const activeLayer = layers.find((l) => l.id === activeLayerId)
    if (!activeLayer) return

    const ctx = activeLayer.canvas.getContext("2d")
    if (!ctx) return

    if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out"
      ctx.lineWidth = brushSize * 2
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.lineTo(coords.x, coords.y)
      ctx.stroke()
    } else if (tool === "brush") {
      if (brushType === "spray") {
        drawSpray(ctx, coords.x, coords.y)
      } else if (brushType === "airbrush") {
        drawAirbrush(ctx, coords.x, coords.y)
      } else {
        ctx.globalCompositeOperation = "source-over"
        ctx.strokeStyle = color
        ctx.globalAlpha = opacity / 100

        if (brushType === "marker") {
          ctx.lineWidth = brushSize * 2
          ctx.lineCap = "round"
        } else if (brushType === "calligraphy") {
          ctx.lineWidth = brushSize
          ctx.lineCap = "square"
        } else if (brushType === "pencil") {
          ctx.lineWidth = brushSize * 0.5
          ctx.lineCap = "round"
        } else {
          ctx.lineWidth = brushSize
          ctx.lineCap = "round"
        }

        ctx.lineJoin = "round"
        ctx.lineTo(coords.x, coords.y)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(coords.x, coords.y)
      }
    }

    setLayers([...layers])
  }

  const drawSpray = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.globalCompositeOperation = "source-over"
    ctx.fillStyle = color
    ctx.globalAlpha = opacity / 100

    const density = brushSize * 2
    for (let i = 0; i < density; i++) {
      const offsetX = (Math.random() - 0.5) * brushSize * 3
      const offsetY = (Math.random() - 0.5) * brushSize * 3
      ctx.fillRect(x + offsetX, y + offsetY, 1, 1)
    }
  }

  const drawAirbrush = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.globalCompositeOperation = "source-over"
    ctx.fillStyle = color

    const density = brushSize * 3
    for (let i = 0; i < density; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = Math.random() * brushSize * 2
      const offsetX = Math.cos(angle) * radius
      const offsetY = Math.sin(angle) * radius
      ctx.globalAlpha = (opacity / 100) * 0.1
      ctx.fillRect(x + offsetX, y + offsetY, 1, 1)
    }
  }

  const stopDrawing = (e: React.MouseEvent) => {
    if (!isDrawing) return

    if (tool === "brush" || tool === "eraser" || tool === "shape") {
      saveToHistory()
    }

    if (tool === "shape" && shapeStart) {
      const coords = getCanvasCoords(e)
      const activeLayer = layers.find((l) => l.id === activeLayerId)
      if (activeLayer) {
        const ctx = activeLayer.canvas.getContext("2d")
        if (ctx) {
          ctx.strokeStyle = color
          ctx.fillStyle = color
          ctx.globalAlpha = opacity / 100
          ctx.lineWidth = brushSize

          const width = coords.x - shapeStart.x
          const height = coords.y - shapeStart.y

          if (shapeType === "rectangle") {
            ctx.strokeRect(shapeStart.x, shapeStart.y, width, height)
          } else if (shapeType === "circle") {
            const radius = Math.sqrt(width * width + height * height)
            ctx.beginPath()
            ctx.arc(shapeStart.x, shapeStart.y, radius, 0, Math.PI * 2)
            ctx.stroke()
          } else if (shapeType === "line") {
            ctx.beginPath()
            ctx.moveTo(shapeStart.x, shapeStart.y)
            ctx.lineTo(coords.x, coords.y)
            ctx.stroke()
          } else if (shapeType === "triangle") {
            ctx.beginPath()
            ctx.moveTo(shapeStart.x, shapeStart.y)
            ctx.lineTo(shapeStart.x + width, shapeStart.y + height)
            ctx.lineTo(shapeStart.x - width, shapeStart.y + height)
            ctx.closePath()
            ctx.stroke()
          }

          ctx.globalAlpha = 1
          setLayers([...layers])
        }
      }
      setShapeStart(null)
    }

    const activeLayer = layers.find((l) => l.id === activeLayerId)
    if (activeLayer) {
      const ctx = activeLayer.canvas.getContext("2d")
      if (ctx) {
        ctx.globalAlpha = 1
        ctx.globalCompositeOperation = "source-over"
      }
    }
    setIsDrawing(false)
    setDragOffset(null)
    setResizing(false)
    setRotating(false)
  }

  const addText = () => {
    if (!textInput || !textPosition) return
    const activeLayer = layers.find((l) => l.id === activeLayerId)
    if (!activeLayer) return

    const newText: TextObject = {
      id: `text-${Date.now()}`,
      text: textInput,
      x: textPosition.x,
      y: textPosition.y,
      fontSize,
      fontFamily,
      color,
      rotation: 0,
      layerId: activeLayer.id,
    }
    setTextObjects([...textObjects, newText])
    saveToHistory()

    setTextInput("")
    setTextPosition(null)
  }

  const updateText = () => {
    if (!editingTextId) return
    setTextObjects(
      textObjects.map((t) =>
        t.id === editingTextId
          ? {
              ...t,
              text: editingTextValue,
              fontSize: editingFontSize,
              fontFamily: editingFontFamily,
              color: editingTextColor,
            }
          : t,
      ),
    )
    saveToHistory()
    setEditingTextId(null)
  }

  const clearCanvas = () => {
    layers.forEach((layer) => {
      const ctx = layer.canvas.getContext("2d")
      if (ctx) {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight)
      }
    })
    setImages([])
    setTextObjects([])
    setLayers([...layers])
    saveToHistory() // Save after clearing
  }

  const downloadImage = () => {
    if (!canvasRef.current) return
    const link = document.createElement("a")
    link.download = `artwork-${Date.now()}.png`
    link.href = canvasRef.current.toDataURL()
    link.click()
  }

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        setCanvasWidth(img.width)
        setCanvasHeight(img.height)
        setTempWidth(img.width)
        setTempHeight(img.height)

        const newLayer = createNewLayer("Background Image", "background")
        newLayer.canvas.width = img.width
        newLayer.canvas.height = img.height
        const ctx = newLayer.canvas.getContext("2d")
        if (ctx) {
          ctx.drawImage(img, 0, 0)
        }
        setLayers([newLayer, ...layers])
        saveToHistory()
      }
      img.src = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        const activeLayer = layers.find((l) => l.id === activeLayerId)
        if (!activeLayer) return

        const newImage: ImageObject = {
          id: `img-${Date.now()}`,
          img,
          x: 50,
          y: 50,
          width: img.width,
          height: img.height,
          rotation: 0,
          layerId: activeLayer.id,
        }
        setImages([...images, newImage])
        saveToHistory()
      }
      img.src = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  const applyCanvasSize = () => {
    setCanvasWidth(tempWidth)
    setCanvasHeight(tempHeight)
    setShowSizeDialog(false)

    setLayers(
      layers.map((layer) => {
        const newCanvas = document.createElement("canvas")
        newCanvas.width = tempWidth
        newCanvas.height = tempHeight
        const newCtx = newCanvas.getContext("2d")
        if (newCtx) {
          newCtx.drawImage(layer.canvas, 0, 0)
        }
        return { ...layer, canvas: newCanvas }
      }),
    )
    saveToHistory() // Save after applying canvas size
  }

  const handleLayerDragStart = (e: React.DragEvent, layerId: string) => {
    setDraggedLayerId(layerId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleLayerDragOver = (e: React.DragEvent, layerId: string) => {
    e.preventDefault()
    setDragOverLayerId(layerId)
  }

  const handleLayerDrop = (e: React.DragEvent, targetLayerId: string) => {
    e.preventDefault()
    if (!draggedLayerId || draggedLayerId === targetLayerId) {
      setDraggedLayerId(null)
      setDragOverLayerId(null)
      return
    }

    const draggedIndex = layers.findIndex((l) => l.id === draggedLayerId)
    const targetIndex = layers.findIndex((l) => l.id === targetLayerId)

    if (draggedIndex === -1 || targetIndex === -1) return

    const newLayers = [...layers]
    const [removed] = newLayers.splice(draggedIndex, 1)
    newLayers.splice(targetIndex, 0, removed)

    setLayers(newLayers)
    setDraggedLayerId(null)
    setDragOverLayerId(null)
  }

  const handleLayerDragEnd = () => {
    setDraggedLayerId(null)
    setDragOverLayerId(null)
  }

  const zoomIn = () => {
    setZoom((prev) => Math.min(prev + 10, 200))
  }

  const zoomOut = () => {
    setZoom((prev) => Math.max(prev - 10, 25))
  }

  const resetZoom = () => {
    setZoom(100)
  }

  if (isMobile) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center">
          <Smartphone className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <div className="text-white text-2xl mb-2" style={{ fontFamily: "var(--font-tiny5)" }}>
            DESKTOP ONLY
          </div>
          <div className="text-white/50 text-sm" style={{ fontFamily: "var(--font-tiny5)" }}>
            DR-01 requires a desktop browser
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black relative flex overflow-hidden">
      <div className={`w-64 border-r ${borderColor} p-4 flex flex-col gap-4 overflow-y-auto`}>
        <div className={`${textColor} opacity-50 text-lg`} style={{ fontFamily: "var(--font-tiny5)" }}>
          DR-01
        </div>

        <div className="flex flex-col gap-2">
          <div className={`${textColor} opacity-30 text-xs`} style={{ fontFamily: "var(--font-tiny5)" }}>
            TOOLS
          </div>
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => setTool("brush")}
              className={`p-2 border ${borderColor} ${
                tool === "brush" ? textColor : `${textColor} opacity-50`
              } hover:opacity-100 transition-opacity flex items-center justify-center`}
              title="Brush"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08" />
                <path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z" />
              </svg>
            </button>
            <button
              onClick={() => setTool("eraser")}
              className={`p-2 border ${borderColor} ${
                tool === "eraser" ? textColor : `${textColor} opacity-50`
              } hover:opacity-100 transition-opacity flex items-center justify-center`}
              title="Eraser"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m7 21-4.3-4.3c-1-1-1-2.4 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21" />
                <path d="M22 21H7" />
              </svg>
            </button>
            <button
              onClick={() => setTool("shape")}
              className={`p-2 border ${borderColor} ${
                tool === "shape" ? textColor : `${textColor} opacity-50`
              } hover:opacity-100 transition-opacity flex items-center justify-center`}
              title="Shape"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              </svg>
            </button>
            <button
              onClick={() => setTool("text")}
              className={`p-2 border ${borderColor} ${
                tool === "text" ? textColor : `${textColor} opacity-50`
              } hover:opacity-100 transition-opacity flex items-center justify-center`}
              title="Text"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 7V4h16v3" />
                <path d="M9 20h6" />
                <path d="M12 4v16" />
              </svg>
            </button>
            <button
              onClick={() => setTool("move")}
              className={`p-2 border ${borderColor} ${
                tool === "move" ? textColor : `${textColor} opacity-50`
              } hover:opacity-100 transition-opacity flex items-center justify-center`}
              title="Move/Transform"
            >
              <Move size={16} />
            </button>
            <button
              onClick={() => setTool("delete")}
              className={`p-2 border ${borderColor} ${
                tool === "delete" ? textColor : `${textColor} opacity-50`
              } hover:opacity-100 transition-opacity flex items-center justify-center`}
              title="Delete"
            >
              <X size={16} />
            </button>
            <button
              onClick={() => setTool("zoom")}
              className={`p-2 border ${borderColor} ${
                tool === "zoom" ? textColor : `${textColor} opacity-50`
              } hover:opacity-100 transition-opacity flex items-center justify-center`}
              title="Zoom"
            >
              <ZoomIn size={16} />
            </button>
          </div>
        </div>

        {tool === "zoom" && (
          <div className="flex flex-col gap-2">
            <div className={`${textColor} opacity-30 text-xs`} style={{ fontFamily: "var(--font-tiny5)" }}>
              ZOOM: {zoom}%
            </div>
            <div className="flex gap-2">
              <button
                onClick={zoomOut}
                className={`flex-1 p-2 border ${borderColor} ${textColor} hover:text-red-500 transition-colors flex items-center justify-center`}
                title="Zoom Out"
              >
                <ZoomOut size={16} />
              </button>
              <button
                onClick={resetZoom}
                className={`flex-1 px-2 py-1 border ${borderColor} ${textColor} hover:text-red-500 transition-colors text-xs`}
                style={{ fontFamily: "var(--font-tiny5)" }}
                title="Reset Zoom"
              >
                {zoom}%
              </button>
              <button
                onClick={zoomIn}
                className={`flex-1 p-2 border ${borderColor} ${textColor} hover:text-red-500 transition-colors flex items-center justify-center`}
                title="Zoom In"
              >
                <ZoomIn size={16} />
              </button>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Tiny5Button
            onClick={undo}
            disabled={historyIndex <= 0}
            className={`${textColor} hover:text-red-500 flex-1 flex items-center justify-center gap-2 text-xs disabled:opacity-30`}
          >
            <Undo size={12} /> UNDO
          </Tiny5Button>
          <Tiny5Button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className={`${textColor} hover:text-red-500 flex-1 flex items-center justify-center gap-2 text-xs disabled:opacity-30`}
          >
            <Redo size={12} /> REDO
          </Tiny5Button>
        </div>

        {tool === "brush" && (
          <div className="flex flex-col gap-2">
            <div className={`${textColor} opacity-30 text-xs`} style={{ fontFamily: "var(--font-tiny5)" }}>
              BRUSH
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(["pen", "marker", "spray", "calligraphy", "pencil", "airbrush"] as BrushType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setBrushType(type)}
                  className={`px-2 py-1 border ${borderColor} ${
                    brushType === type ? textColor : `${textColor} opacity-50`
                  } hover:opacity-100 transition-opacity text-xs uppercase`}
                  style={{ fontFamily: "var(--font-tiny5)" }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        )}

        {tool === "shape" && (
          <div className="flex flex-col gap-2">
            <div className={`${textColor} opacity-30 text-xs`} style={{ fontFamily: "var(--font-tiny5)" }}>
              SHAPE
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(["rectangle", "circle", "line", "triangle"] as ShapeType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setShapeType(type)}
                  className={`px-2 py-1 border ${borderColor} ${
                    shapeType === type ? textColor : `${textColor} opacity-50`
                  } hover:opacity-100 transition-opacity text-xs uppercase`}
                  style={{ fontFamily: "var(--font-tiny5)" }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        )}

        {tool === "text" && (
          <div className="flex flex-col gap-2">
            <div className={`${textColor} opacity-30 text-xs`} style={{ fontFamily: "var(--font-tiny5)" }}>
              TEXT
            </div>
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className={`w-full bg-black border ${borderColor} ${textColor} px-2 py-1 text-xs`}
              style={{ fontFamily: "var(--font-tiny5)" }}
            >
              {fonts.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
            <div className={`${textColor} opacity-30 text-xs`} style={{ fontFamily: "var(--font-tiny5)" }}>
              SIZE: {fontSize}
            </div>
            <input
              type="range"
              min="12"
              max="100"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full"
            />
          </div>
        )}

        {tool !== "eraser" && (
          <div className="flex flex-col gap-2">
            <div className={`${textColor} opacity-30 text-xs`} style={{ fontFamily: "var(--font-tiny5)" }}>
              COLOR
            </div>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full h-12 cursor-pointer"
            />
          </div>
        )}

        <div className="flex flex-col gap-2">
          <div className={`${textColor} opacity-30 text-xs`} style={{ fontFamily: "var(--font-tiny5)" }}>
            BACKGROUND
          </div>
          <input
            type="color"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
            className="w-full h-12 cursor-pointer"
          />
        </div>

        {(tool === "brush" || tool === "eraser" || tool === "shape") && (
          <div className="flex flex-col gap-2">
            <div className={`${textColor} opacity-30 text-xs`} style={{ fontFamily: "var(--font-tiny5)" }}>
              SIZE: {brushSize}
            </div>
            <input
              type="range"
              min="1"
              max="50"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-full"
            />
          </div>
        )}

        {tool !== "eraser" && (
          <div className="flex flex-col gap-2">
            <div className={`${textColor} opacity-30 text-xs`} style={{ fontFamily: "var(--font-tiny5)" }}>
              OPACITY: {opacity}%
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="w-full"
            />
          </div>
        )}

        <div className={`border-t ${borderColor} pt-4 mt-4`}>
          <div className={`${textColor} opacity-50 text-lg mb-3`} style={{ fontFamily: "var(--font-tiny5)" }}>
            EFFECTS
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(["blur", "grayscale", "sepia", "invert", "brightness", "contrast", "pixelate"] as Effect[]).map(
              (effect) => (
                <button
                  key={effect}
                  onClick={() => setActiveEffect(activeEffect === effect ? null : effect)}
                  className={`px-2 py-1 border ${borderColor} ${
                    activeEffect === effect ? textColor : `${textColor} opacity-50`
                  } hover:opacity-100 transition-opacity text-xs uppercase`}
                  style={{ fontFamily: "var(--font-tiny5)" }}
                >
                  {effect}
                </button>
              ),
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-auto pt-4">
          <input
            type="file"
            ref={backgroundInputRef}
            onChange={handleBackgroundUpload}
            accept="image/*"
            className="hidden"
          />
          <input type="file" ref={imageInputRef} onChange={handleAddImage} accept="image/*" className="hidden" />
          <Tiny5Button
            onClick={() => backgroundInputRef.current?.click()}
            className={`${textColor} hover:text-red-500 w-full flex items-center justify-center gap-2 text-xs`}
          >
            <Upload size={12} /> BG IMAGE
          </Tiny5Button>
          <Tiny5Button
            onClick={() => imageInputRef.current?.click()}
            className={`${textColor} hover:text-red-500 w-full flex items-center justify-center gap-2 text-xs`}
          >
            <Plus size={12} /> ADD IMAGE
          </Tiny5Button>
          <Tiny5Button
            onClick={() => setShowSizeDialog(!showSizeDialog)}
            className={`${textColor} hover:text-red-500 w-full flex items-center justify-center gap-2 text-xs`}
          >
            <Settings size={12} /> CANVAS
          </Tiny5Button>
          <Tiny5Button onClick={clearCanvas} className={`${textColor} hover:text-red-500 w-full text-xs`}>
            CLEAR ALL
          </Tiny5Button>
          <Tiny5Button
            onClick={downloadImage}
            className={`${textColor} hover:text-red-500 w-full flex items-center justify-center gap-2 text-xs`}
          >
            <Download size={12} /> SAVE
          </Tiny5Button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className={`border-2 ${borderColor} ${
              tool === "brush" || tool === "eraser"
                ? "cursor-crosshair"
                : tool === "text"
                  ? "cursor-text"
                  : tool === "move"
                    ? "cursor-move"
                    : tool === "delete"
                      ? "cursor-not-allowed"
                      : tool === "zoom"
                        ? "cursor-zoom-in"
                        : // Added zoom cursor
                          "cursor-default"
            } max-w-full`}
            style={{
              maxHeight: "calc(100vh - 4rem)",
              backgroundColor: backgroundColor,
              transform: `scale(${zoom / 100})`,
              transformOrigin: "center center",
              transition: "transform 0.1s ease-out",
            }}
          />
        </div>
      </div>

      <div className={`w-64 border-l ${borderColor} p-4 flex flex-col gap-4 overflow-y-auto`}>
        <div
          className={`${textColor} opacity-50 text-lg flex items-center justify-between`}
          style={{ fontFamily: "var(--font-tiny5)" }}
        >
          LAYERS
          <button onClick={addLayer} className={`${textColor} hover:text-red-500 transition-colors`}>
            <Plus size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {[...layers].reverse().map((layer) => (
            <div
              key={layer.id}
              draggable
              onDragStart={(e) => handleLayerDragStart(e, layer.id)}
              onDragOver={(e) => handleLayerDragOver(e, layer.id)}
              onDrop={(e) => handleLayerDrop(e, layer.id)}
              onDragEnd={handleLayerDragEnd}
              className={`p-2 border ${
                activeLayerId === layer.id
                  ? "border-red-500"
                  : dragOverLayerId === layer.id
                    ? "border-red-500/50"
                    : borderColor
              } ${bgColor} cursor-pointer transition-all ${draggedLayerId === layer.id ? "opacity-50" : ""}`}
              onClick={() => setActiveLayerId(layer.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <GripVertical size={14} className={`${textColor} opacity-30`} />
                  <div className={`${textColor} text-xs`} style={{ fontFamily: "var(--font-tiny5)" }}>
                    {layer.name}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleLayerVisibility(layer.id)
                    }}
                    className={`${textColor} hover:text-red-500 transition-colors`}
                  >
                    {layer.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  {layers.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteLayer(layer.id)
                      }}
                      className={`${textColor} hover:text-red-500 transition-colors`}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className={`${textColor} opacity-30 text-xs`} style={{ fontFamily: "var(--font-tiny5)" }}>
                  OPACITY: {layer.opacity}%
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={layer.opacity}
                  onChange={(e) => {
                    e.stopPropagation()
                    updateLayerOpacity(layer.id, Number(e.target.value))
                  }}
                  className="w-full"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {textPosition && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className={`${bgColor} border ${borderColor} p-6 max-w-md w-full m-4`}>
            <div className={`${textColor} opacity-50 text-lg mb-4`} style={{ fontFamily: "var(--font-tiny5)" }}>
              ENTER TEXT
            </div>
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Type your text..."
              className={`w-full bg-black border ${borderColor} ${textColor} px-3 py-2 mb-4`}
              style={{ fontFamily: fontFamily, fontSize: `${fontSize}px` }}
              autoFocus
            />
            <div className="flex gap-2">
              <Tiny5Button onClick={addText} className={`${textColor} hover:text-red-500 flex-1`}>
                ADD
              </Tiny5Button>
              <Tiny5Button
                onClick={() => {
                  setTextPosition(null)
                  setTextInput("")
                }}
                className={`${textColor} hover:text-red-500 flex-1`}
              >
                CANCEL
              </Tiny5Button>
            </div>
          </div>
        </div>
      )}

      {showSizeDialog && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className={`${bgColor} border ${borderColor} p-6 max-w-md w-full m-4`}>
            <div className={`${textColor} opacity-50 text-lg mb-4`} style={{ fontFamily: "var(--font-tiny5)" }}>
              CANVAS SIZE
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label
                  className={`${textColor} opacity-30 text-xs block mb-2`}
                  style={{ fontFamily: "var(--font-tiny5)" }}
                >
                  WIDTH
                </label>
                <input
                  type="number"
                  value={tempWidth}
                  onChange={(e) => setTempWidth(Number(e.target.value))}
                  className={`w-full bg-black border ${borderColor} ${textColor} px-3 py-2 text-sm`}
                  style={{ fontFamily: "var(--font-tiny5)" }}
                />
              </div>
              <div>
                <label
                  className={`${textColor} opacity-30 text-xs block mb-2`}
                  style={{ fontFamily: "var(--font-tiny5)" }}
                >
                  HEIGHT
                </label>
                <input
                  type="number"
                  value={tempHeight}
                  onChange={(e) => setTempHeight(Number(e.target.value))}
                  className={`w-full bg-black border ${borderColor} ${textColor} px-3 py-2 text-sm`}
                  style={{ fontFamily: "var(--font-tiny5)" }}
                />
              </div>
              <div className="flex gap-2">
                <Tiny5Button onClick={applyCanvasSize} className={`${textColor} hover:text-red-500 flex-1`}>
                  APPLY
                </Tiny5Button>
                <Tiny5Button
                  onClick={() => setShowSizeDialog(false)}
                  className={`${textColor} hover:text-red-500 flex-1`}
                >
                  CANCEL
                </Tiny5Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editingTextId && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className={`${bgColor} border ${borderColor} p-6 max-w-md w-full m-4`}>
            <div className={`${textColor} opacity-50 text-lg mb-4`} style={{ fontFamily: "var(--font-tiny5)" }}>
              EDIT TEXT
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label
                  className={`${textColor} opacity-30 text-xs block mb-2`}
                  style={{ fontFamily: "var(--font-tiny5)" }}
                >
                  TEXT
                </label>
                <input
                  type="text"
                  value={editingTextValue}
                  onChange={(e) => setEditingTextValue(e.target.value)}
                  className={`w-full bg-black border ${borderColor} ${textColor} px-3 py-2`}
                  autoFocus
                />
              </div>
              <div>
                <label
                  className={`${textColor} opacity-30 text-xs block mb-2`}
                  style={{ fontFamily: "var(--font-tiny5)" }}
                >
                  FONT
                </label>
                <select
                  value={editingFontFamily}
                  onChange={(e) => setEditingFontFamily(e.target.value)}
                  className={`w-full bg-black border ${borderColor} ${textColor} px-2 py-1 text-xs`}
                >
                  {fonts.map((font) => (
                    <option key={font} value={font}>
                      {font}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  className={`${textColor} opacity-30 text-xs block mb-2`}
                  style={{ fontFamily: "var(--font-tiny5)" }}
                >
                  SIZE: {editingFontSize}
                </label>
                <input
                  type="range"
                  min="12"
                  max="100"
                  value={editingFontSize}
                  onChange={(e) => setEditingFontSize(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label
                  className={`${textColor} opacity-30 text-xs block mb-2`}
                  style={{ fontFamily: "var(--font-tiny5)" }}
                >
                  COLOR
                </label>
                <input
                  type="color"
                  value={editingTextColor}
                  onChange={(e) => setEditingTextColor(e.target.value)}
                  className="w-full h-12 cursor-pointer"
                />
              </div>
              <div className="flex gap-2">
                <Tiny5Button onClick={updateText} className={`${textColor} hover:text-red-500 flex-1`}>
                  UPDATE
                </Tiny5Button>
                <Tiny5Button
                  onClick={() => setEditingTextId(null)}
                  className={`${textColor} hover:text-red-500 flex-1`}
                >
                  CANCEL
                </Tiny5Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
