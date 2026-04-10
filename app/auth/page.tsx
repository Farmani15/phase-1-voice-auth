"use client"

import useSWR from "swr"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { VoiceRecorder } from "@/components/voice-recorder"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Spinner } from "@/components/ui/spinner"
import { useToast } from "@/components/ui/use-toast"
import React from "react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface VoiceProfile {
  id: string
  name: string
  enrolledAt: string
  active: boolean
}

export default function AuthPage() {
  const { data, isLoading, mutate } = useSWR<{ phrase: string; nonce: string }>("/api/challenge", fetcher)
  const { data: voices, isLoading: voicesLoading } = useSWR<VoiceProfile[]>("/api/voices", fetcher)
  const router = useRouter()
  const { toast } = useToast()
  const [selectedVoiceId, setSelectedVoiceId] = React.useState<string>("")

  const [secondsLeft, setSecondsLeft] = React.useState(10)

  const refreshPhrase = React.useCallback(
    (reason?: "manual" | "expired") => {
      setSecondsLeft(10)
      mutate()
      if (reason === "expired") {
        toast({
          title: "Phrase refreshed",
          description: "Timer expired. A new phrase is ready.",
        })
      }
    },
    [mutate, toast],
  )

  React.useEffect(() => {
    if (!data?.phrase) return
    setSecondsLeft(10)
    const id = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(id)
          // auto-refresh on expiry
          refreshPhrase("expired")
          return 10
        }
        return prev - 1
      })
    }, 1000)
    return () => window.clearInterval(id)
  }, [data?.phrase, refreshPhrase])

  async function handleVerify(audio: Blob | null) {
    if (!audio || !data || !selectedVoiceId) {
      toast({ title: "Error", description: "Please select a voice profile first." })
      return
    }
    const fd = new FormData()
    fd.append("audio", audio, "voice.webm")
    fd.append("phrase", data.phrase)
    fd.append("nonce", data.nonce)
    fd.append("voiceId", selectedVoiceId)

    const res = await fetch("/api/verify", { method: "POST", body: fd })
    const json = await res.json()

    if (json?.ok) {
      toast({ 
        title: "Verified", 
        description: `Welcome back, ${json.voiceName}`,
      })
      setTimeout(() => router.push("/dashboard"), 500)
    } else {
      // Refresh phrase on failure
      mutate()
      toast({ 
        title: "Verification failed", 
        description: json.error || "Voice not recognized. Try the new phrase.",
      })
    }
  }

  async function handleCopy() {
    if (!data?.phrase) return
    await navigator.clipboard.writeText(data.phrase)
    toast({ title: "Phrase copied", description: "Paste and rehearse to ensure exactness." })
  }

  // Hotkey: N = new phrase
  // Note: R hotkey is handled inside VoiceRecorder for low-latency capture.
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key.toLowerCase() === "n") {
        e.preventDefault()
        refreshPhrase("manual")
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [refreshPhrase])

  return (
    <main className="min-h-[100svh] bg-background text-foreground">
      <section className="mx-auto max-w-4xl px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={cn(
            "rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md",
            "shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_30px_90px_-30px_oklch(0.5_0.2_200/0.25)]",
          )}
        >
          <header className="mb-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-muted-foreground">
              <span className="size-2 rounded-full bg-[color:var(--color-chart-2)]" />
              Challenge: Speak Exact Phrase
            </div>
            <h1 className="mt-4 text-2xl font-semibold">Say it. Exactly.</h1>
            <p className="text-sm text-muted-foreground">
              Calm room, steady breath. Own the phrase. Press R to record, N for a new phrase.
            </p>
          </header>

          <div className="mb-6 rounded-lg border border-white/10 bg-black/30 p-4">
            <p className="text-xs text-muted-foreground mb-2">Who are you?</p>
            {voicesLoading ? (
              <div className="flex items-center gap-2 text-sm">
                <Spinner className="size-4" /> Loading voices...
              </div>
            ) : voices && voices.length > 0 ? (
              <select
                value={selectedVoiceId}
                onChange={(e) => setSelectedVoiceId(e.target.value)}
                className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-chart-2)]"
              >
                <option value="">Select a registered voice...</option>
                {voices.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-xs text-muted-foreground">
                No voices registered yet.{" "}
                <a href="/enroll" className="underline text-[color:var(--color-chart-2)] hover:no-underline">
                  Enroll one now.
                </a>
              </p>
            )}
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-lg border border-white/10 bg-black/30 p-4">
              <p className="text-xs text-muted-foreground">Phrase</p>
              <div className="mt-2 flex items-center gap-2" aria-live="polite" aria-atomic="true">
                <div className="flex-1 rounded-md border border-white/10 bg-white/5 p-4 font-mono text-sm">
                  {isLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <Spinner className="size-4" /> Loading…
                    </span>
                  ) : (
                    (data?.phrase ?? "—")
                  )}
                </div>
                <Button variant="secondary" size="sm" onClick={handleCopy} disabled={!data?.phrase || isLoading}>
                  Copy
                </Button>
                <span
                  className="rounded border border-white/10 bg-white/5 px-2 py-1 text-xs tabular-nums text-muted-foreground"
                  aria-label="phrase expires in seconds"
                >
                  {secondsLeft}s
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Read in one pass. No fillers. Match the text exactly.
              </p>
              <div className="mt-3 text-xs text-muted-foreground">
                Nonce: <span className="font-mono">{isLoading ? "…" : (data?.nonce ?? "—")}</span>
              </div>
              <Button variant="secondary" className="mt-4" onClick={() => refreshPhrase("manual")} disabled={isLoading}>
                New Phrase (N)
              </Button>
              <div className="mt-4 text-xs text-muted-foreground">
                Status: <span className="text-[color:var(--color-chart-2)]">Ready</span>
              </div>
            </div>

            <div className="rounded-lg border border-white/10 bg-black/30 p-4">
              <VoiceRecorder phrase={data?.phrase} onVerify={handleVerify} />
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  )
}
