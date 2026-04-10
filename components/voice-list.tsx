"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Trash2, CheckCircle2, Clock } from "lucide-react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface VoiceProfile {
  id: string
  name: string
  enrolledAt: string
  active: boolean
  status: "verified" | "enrolled"
}

export function VoiceList() {
  const { data, isLoading, mutate } = useSWR<{ voices: VoiceProfile[] }>(
    "/api/voices",
    fetcher
  )
  const { toast } = useToast()

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete voice profile for ${name}?`)) return

    try {
      const response = await fetch(`/api/voices/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Delete failed")

      toast({
        title: "Voice deleted",
        description: `${name}'s profile has been removed`,
      })

      mutate()
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Try again",
        variant: "destructive",
      })
    }
  }

  const handleToggleActive = async (id: string, name: string, active: boolean) => {
    try {
      const response = await fetch(`/api/voices/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !active }),
      })

      if (!response.ok) throw new Error("Update failed")

      toast({
        title: active ? "Voice disabled" : "Voice enabled",
        description: `${name} is now ${!active ? "active" : "inactive"}`,
      })

      mutate()
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Try again",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/5 p-8 backdrop-blur-md text-center">
        <p className="text-gray-400">Loading voices...</p>
      </div>
    )
  }

  const voices = data?.voices || []

  if (voices.length === 0) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/5 p-8 backdrop-blur-md text-center">
        <p className="text-gray-400">No voices enrolled yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Registered Voices</h3>
      <div className="grid gap-3">
        {voices.map((voice) => (
          <div
            key={voice.id}
            className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-md flex items-center justify-between hover:bg-white/8 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-base font-semibold text-white truncate">
                  {voice.name}
                </h4>
                {voice.status === "verified" ? (
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-xs whitespace-nowrap">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified
                  </div>
                ) : (
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-xs whitespace-nowrap">
                    <Clock className="w-3 h-3" />
                    Enrolled
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-400">
                Enrolled {formatDate(voice.enrolledAt)}
              </p>
            </div>

            <div className="flex gap-2 ml-4 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  handleToggleActive(voice.id, voice.name, voice.active)
                }
                className="text-xs h-8 px-2"
              >
                {voice.active ? "Disable" : "Enable"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(voice.id, voice.name)}
                className="text-xs text-red-400 hover:text-red-300 h-8 px-2"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return "yesterday"
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString()
}
