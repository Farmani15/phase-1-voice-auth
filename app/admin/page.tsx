"use client"

import useSWR from "swr"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function AdminPage() {
  const { data } = useSWR<{ eer: any[]; far: any[]; frr: any[]; latency: any[] }>("/api/stats", fetcher)

  return (
    <main className="min-h-[100svh] bg-background text-foreground">
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Admin Panel</h1>
          <p className="text-muted-foreground">User management and system metrics</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <ChartCard title="EER (Equal Error Rate)" data={data?.eer} color="oklch(0.65_0.12_220)" />
          <ChartCard title="FAR (False Accept Rate)" data={data?.far} color="oklch(0.62_0.12_180)" />
          <ChartCard title="FRR (False Reject Rate)" data={data?.frr} color="oklch(0.62_0.12_160)" />
          <ChartCard title="Latency (ms)" data={data?.latency} color="oklch(0.7_0.14_200)" />
        </div>
      </section>
    </main>
  )
}

function ChartCard({
  title,
  data = [],
  color,
}: {
  title: string
  data?: { t: string; v: number }[]
  color: string
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
      <h3 className="mb-3 text-sm font-medium">{title}</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis dataKey="t" stroke="rgba(255,255,255,0.5)" />
            <YAxis stroke="rgba(255,255,255,0.5)" />
            <Tooltip
              contentStyle={{
                background: "color-mix(in oklch, var(--color-background) 80%, transparent)",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(6px)",
              }}
            />
            <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={false} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
