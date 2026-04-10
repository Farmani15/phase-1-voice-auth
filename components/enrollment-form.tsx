"use client"

import { useState, useRef } from "react"
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
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const { toast } = useToast()

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
      setIsRecording(true)
      toast({
        title: "Recording started",
        description: "Say your passphrase clearly",
      })
    } catch (error) {
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
        title: "Recording stopped",
        description: "Ready to enroll",
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

      const response = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          audioBlob: base64Audio,
        }),
      })

      if (!response.ok) throw new Error("Enrollment failed")

      const data = await response.json()

      toast({
        title: "Voice enrolled successfully",
        description: `${data.profile.name} is now registered`,
      })

      setName("")
      chunksRef.current = []
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
        <p className="text-xs text-gray-400">
          {isRecording ? "Recording in progress..." : chunksRef.current.length > 0 ? "Recording captured" : "No recording yet"}
        </p>
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
