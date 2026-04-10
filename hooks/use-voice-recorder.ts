"use client"

import { useEffect, useRef, useState, useCallback } from "react"

export function useVoiceRecorder() {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<BlobPart[]>([])
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [isRecording, setIsRecording] = useState(false)

  // Audio graph for visualization
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" })
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm;codecs=opus" })
        setAudioBlob(blob)
      }
      mediaRecorder.start()
      setIsRecording(true)

      // Setup audio context for visualization
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
      audioCtxRef.current = audioCtx
      const source = audioCtx.createMediaStreamSource(stream)
      sourceRef.current = source
      const an = audioCtx.createAnalyser()
      an.smoothingTimeConstant = 0.8
      an.minDecibels = -90
      an.maxDecibels = -10
      source.connect(an)
      setAnalyser(an)
    } catch (error) {
      console.error("[v0] Failed to start recording:", error)
    }
  }, [])

  const stop = useCallback(async () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
    }
    setIsRecording(false)
    
    // Stop all media tracks
    streamRef.current?.getTracks().forEach((track) => track.stop())
    
    // Disconnect audio graph safely
    try {
      sourceRef.current?.disconnect()
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        await audioCtxRef.current.close()
      }
    } catch (error) {
      console.error("[v0] Error stopping audio context:", error)
    }
  }, [])

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop()
      }
      
      // Stop all media tracks
      streamRef.current?.getTracks().forEach((track) => track.stop())
      
      try {
        sourceRef.current?.disconnect()
        if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
          audioCtxRef.current.close()
        }
      } catch (error) {
        console.error("[v0] Cleanup error:", error)
      }
    }
  }, [])

  return { isRecording, start, stop, audioBlob, analyser }
}
