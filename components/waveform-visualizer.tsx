"use client"

import { useEffect, useRef } from "react"

export function WaveformVisualizer({ analyser }: { analyser: AnalyserNode | null }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !analyser) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    analyser.fftSize = 1024
    const bufferLength = analyser.fftSize
    const dataArray = new Uint8Array(bufferLength)

    function draw() {
      analyser.getByteTimeDomainData(dataArray)
      const { width, height } = canvas
      ctx.clearRect(0, 0, width, height)

      // background glassy panel
      ctx.fillStyle = "rgba(0,0,0,0)"
      ctx.fillRect(0, 0, width, height)

      // waveform
      ctx.lineWidth = 2
      ctx.strokeStyle = "oklch(0.85 0.1 210)"
      ctx.beginPath()

      const sliceWidth = (width * 1.0) / bufferLength
      let x = 0
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0
        const y = (v * height) / 2
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
        x += sliceWidth
      }
      ctx.lineTo(width, height / 2)
      ctx.stroke()

      rafRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [analyser])

  return (
    <canvas
      ref={canvasRef}
      className="h-24 w-full rounded-md border border-white/10 bg-black/30"
      width={600}
      height={96}
      aria-label="Voice waveform visualization"
    />
  )
}
