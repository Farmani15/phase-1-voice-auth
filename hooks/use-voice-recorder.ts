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

  const start = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
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
  }, [])

  const stop = useCallback(async () => {
    mediaRecorderRef.current?.stop()
    setIsRecording(false)
    // Disconnect audio graph
    try {
      sourceRef.current?.disconnect()
      await audioCtxRef.current?.close()
    } catch {}
  }, [])

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop()
      }
      try {
        sourceRef.current?.disconnect()
        audioCtxRef.current?.close()
      } catch {}
    }
  }, [])

  return { isRecording, start, stop, audioBlob, analyser }
}
