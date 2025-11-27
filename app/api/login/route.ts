import { NextResponse } from "next/server"

export async function POST() {
  // Placeholder: in real app, create session in Redis via FastAPI
  return NextResponse.json({
    ok: true,
    session: { id: crypto.randomUUID(), expiresIn: 3600 },
    pqc: { kyber: "ok", dilithium: "ok" },
  })
}
