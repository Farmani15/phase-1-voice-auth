"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { WaveformVisualizer } from "./waveform-visualizer"
import { useVoiceRecorder } from "@/hooks/use-voice-recorder"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function VoiceRecorder({
  phrase,
  onVerify,
}: {
  phrase?: string
  onVerify: (audio: Blob | null) => void
}) {
  const { isRecording, start, stop, audioBlob, analyser } = useVoiceRecorder()
  const [progress, setProgress] = useState<"idle" | "recording" | "liveness" | "verifying">("idle")
  const [elapsed, setElapsed] = useState(0)
  const timerRef = useRef<number | null>(null)

  const handleStart = useCallback(async () => {
    if (!phrase) return
    await start()
    setProgress("recording")
    setElapsed(0)
    if (timerRef.current) cancelAnimationFrame(timerRef.current)
    const started = performance.now()
    const tick = (t: number) => {
      setElapsed(Math.floor((t - started) / 1000))
      timerRef.current = requestAnimationFrame(tick)
    }
    timerRef.current = requestAnimationFrame(tick)
  }, [start, phrase])

  const handleStop = useCallback(async () => {
    await stop()
    if (timerRef.current) cancelAnimationFrame(timerRef.current)
    setProgress("liveness")
    // Simulate liveness computation
    setTimeout(() => setProgress("verifying"), 800)
    setTimeout(() => onVerify(audioBlob), 1200)
  }, [stop, onVerify, audioBlob])

  // Hotkey: R toggles recording (low-latency)
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key.toLowerCase() !== "r") return
      e.preventDefault()
      if (!phrase) return
      if (!isRecording) {
        handleStart()
      } else {
        handleStop()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [isRecording, handleStart, handleStop, phrase])

  useEffect(() => {
    return () => {
      if (timerRef.current) cancelAnimationFrame(timerRef.current)
    }
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {phrase ? (
            <>
              Read it clean: <span className="font-mono text-foreground">{phrase}</span>
            </>
          ) : (
            "Waiting for phrase…"
          )}
        </div>
        <Status progress={progress} />
      </div>

      <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-4" aria-live="polite">
        <div className="flex items-center gap-4">
          <motion.div
            animate={{
              boxShadow: isRecording
                ? "0 0 0 6px rgba(56,189,248,0.15), 0 0 24px oklch(0.65 0.12 210 / 0.6)"
                : "0 0 0 0 rgba(0,0,0,0)",
            }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className={cn(
              "size-12 shrink-0 rounded-full border border-white/10",
              isRecording ? "bg-[oklch(0.45_0.17_220)]" : "bg-black/40",
            )}
            aria-label={isRecording ? "Recording…" : "Idle"}
            role="status"
          />
          <div className="flex-1">
            <WaveformVisualizer analyser={analyser} />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          {!isRecording ? (
            <Button
              onClick={handleStart}
              className={cn("bg-[oklch(0.45_0.17_220)] hover:bg-[oklch(0.45_0.17_220/0.9)] text-white")}
              disabled={!phrase}
            >
              Start Recording (R)
            </Button>
          ) : (
            <Button variant="destructive" onClick={handleStop}>
              Stop & Verify
            </Button>
          )}
          <div className="text-xs text-muted-foreground">
            Recording format: <span className="font-mono">webm/opus</span>
          </div>
          <div className="ml-auto text-xs font-mono text-muted-foreground" aria-label="Elapsed recording time">
            {progress === "recording"
              ? `${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`
              : "00:00"}
          </div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Talk like you mean it—normal volume, steady pace. No whispers, no shouting.
        </p>
      </div>
    </div>
  )
}

function Status({ progress }: { progress: "idle" | "recording" | "liveness" | "verifying" }) {
  const label =
    progress === "idle"
      ? "Standby"
      : progress === "recording"
        ? "Recording"
        : progress === "liveness"
          ? "Liveness"
          : "Verifying"
  return (
    <div
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs"
      aria-live="polite"
    >
      <span
        className={cn(
          "size-2 rounded-full",
          progress === "recording" ? "bg-[oklch(0.65_0.12_220)]" : "bg-[oklch(0.7_0.16_170)]",
        )}
      />
      {label}
    </div>
  )
}
