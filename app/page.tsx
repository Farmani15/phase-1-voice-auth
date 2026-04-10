"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export default function Page() {
  return (
    <main className="min-h-[100svh] bg-background text-foreground relative overflow-hidden">
      {/* clean top app bar */}
      <header className="relative z-10">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="size-2 rounded-full bg-[color:var(--color-chart-2)]" aria-hidden />
            <span className="font-medium tracking-tight">Quantum Voice</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/auth" className="hover:text-foreground transition-colors">
              Authenticate
            </Link>
            <Link href="/enroll" className="hover:text-foreground transition-colors">
              Enroll
            </Link>
            <Link href="/admin" className="hover:text-foreground transition-colors">
              Console
            </Link>
          </nav>
        </div>
      </header>

      {/* background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 60% at 70% 30%, color-mix(in oklch, var(--color-chart-2) 35%, transparent), transparent), radial-gradient(40% 40% at 20% 80%, color-mix(in oklch, var(--color-chart-3) 35%, transparent), transparent)",
          opacity: 0.6,
        }}
      />
      <section className="relative mx-auto max-w-5xl px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={cn(
            "rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md",
            "shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_30px_90px_-30px_oklch(0.5_0.2_200/0.35)]",
          )}
          style={{
            boxShadow:
              "0 0 0 1px color-mix(in oklch, var(--color-foreground) 6%, transparent), 0 30px 90px -30px color-mix(in oklch, var(--color-chart-3) 35%, transparent)",
          }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-muted-foreground">
            <span className="size-2 rounded-full bg-[color:var(--color-chart-2)] shadow-[0_0_10px_theme(colors.blue.400)]" />
            Zero‑Trust Biometric Ingress
          </div>

          {/* refined hero copy */}
          <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Quantum‑grade Voice Authentication
          </h1>

          <p className="mt-4 text-pretty text-muted-foreground sm:text-lg">
            Production‑ready. Liveness enforced, challenge–response verified, PQC hybrid handshake (Kyber + Dilithium).
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/auth">
              <Button
                className={cn(
                  "relative px-6",
                  "bg-[color:var(--color-chart-3)] hover:bg-[color:var(--color-chart-3)]/90",
                  "text-[color:var(--color-primary-foreground)]",
                )}
                style={{
                  boxShadow: "0 0 16px color-mix(in oklch, var(--color-chart-3) 45%, transparent)",
                }}
              >
                Initiate Auth
              </Button>
            </Link>
            <Link href="/admin" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Ops Console
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-10 grid gap-6 sm:grid-cols-2"
        >
          <FeatureCard title="AI Liveness" desc="Anti‑replay. Mic consistency. Real‑time spoof checks." />
        </motion.div>

        {/* Human Avatars Section */}
        {/* Testimonials/Faces Section Removed */}
      </section>
    </main>
  )
}

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileFocusWithin={{ y: -2 }}
      transition={{ type: "spring", stiffness: 280, damping: 24 }}
      className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md outline-none"
      tabIndex={0}
      aria-label={title}
    >
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
    </motion.div>
  )
}
