import { NextResponse } from "next/server"

const t = ["10:00", "10:10", "10:20", "10:30", "10:40", "10:50"]

export async function GET() {
  return NextResponse.json({
    eer: t.map((x, i) => ({ t: x, v: 1.1 + Math.sin(i / 2) * 0.1 })),
    far: t.map((x, i) => ({ t: x, v: 0.4 + Math.cos(i / 3) * 0.05 })),
    frr: t.map((x, i) => ({ t: x, v: 0.6 + Math.sin(i / 3) * 0.05 })),
    latency: t.map((x, i) => ({ t: x, v: 42 + (i % 3) * 6 })),
  })
}
