"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Mic, Square } from "lucide-react"

interface EnrollmentFormProps {
  onSuccess?: () => void
}

export function EnrollmentForm({ onSuccess }: EnrollmentFormProps) {
  const [name, setName] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()

  // Timer effect
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isRecording])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)

      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.start()
      setRecordingTime(0)
      setIsRecording(true)
      toast({
        title: "🎤 Recording started",
        description: "Speak clearly for 10-15 seconds",
      })
    } catch (error) {
      console.error("[v0] Recording error:", error)
      toast({
        title: "Microphone access denied",
        description: "Enable microphone to record voice",
        variant: "destructive",
      })
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
      setIsRecording(false)
      toast({
        title: "✓ Recording stopped",
        description: `Captured ${recordingTime} seconds of audio`,
      })
    }
  }

  const handleEnroll = async () => {
    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Enter a name for this voice profile",
        variant: "destructive",
      })
      return
    }

    if (chunksRef.current.length === 0) {
      toast({
        title: "No recording",
        description: "Record your voice first",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const audioBlob = new Blob(chunksRef.current, { type: "audio/wav" })
      const base64Audio = await blobToBase64(audioBlob)

      console.log("[v0] Enrolling voice:", name)
      const response = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          audioBlob: base64Audio,
        }),
      })

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.error || "Enrollment failed")
      }

      const data = await response.json()
      console.log("[v0] Enrollment response:", data)

      toast({
        title: "✓ Voice enrolled successfully",
        description: `${data.profile.name} is now registered`,
      })

      setName("")
      chunksRef.current = []
      setRecordingTime(0)
      onSuccess?.()
    } catch (error) {
      console.error("[v0] Enrollment error:", error)
      toast({
        title: "Enrollment failed",
        description: "Try again",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(",")[1]
        resolve(base64)
      }
      reader.readAsDataURL(blob)
    })
  }

  return (
    <div className="space-y-4 rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur-md">
      <h3 className="text-lg font-semibold text-white">Enroll New Voice</h3>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Name
        </label>
        <Input
          type="text"
          placeholder="Enter person's name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isRecording || isSubmitting}
          className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Voice Recording
        </label>
        <div className="flex gap-2">
          {!isRecording ? (
            <Button
              onClick={startRecording}
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Mic className="w-4 h-4 mr-2" />
              Start Recording
            </Button>
          ) : (
            <Button
              onClick={stopRecording}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              <Square className="w-4 h-4 mr-2" />
              Stop Recording
            </Button>
          )}
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">
            {isRecording ? (
              <span className="text-blue-400 font-medium animate-pulse">
                🎤 Recording... Speak clearly (10-15 seconds recommended)
              </span>
            ) : chunksRef.current.length > 0 ? (
              <span className="text-green-400">✓ Recording captured ({recordingTime}s)</span>
            ) : (
              "No recording yet"
            )}
          </p>
          {isRecording && (
            <span className="text-sm font-mono text-blue-400 tabular-nums">
              {Math.floor(recordingTime / 60)}:{String(recordingTime % 60).padStart(2, "0")}
            </span>
          )}
        </div>
      </div>

      <Button
        onClick={handleEnroll}
        disabled={isSubmitting || isRecording}
        className="w-full bg-green-600 hover:bg-green-700 text-white"
      >
        {isSubmitting ? "Enrolling..." : "Enroll Voice"}
      </Button>
    </div>
  )
}
