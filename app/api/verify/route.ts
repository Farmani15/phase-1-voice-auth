import { NextResponse } from "next/server"

// Placeholder verification endpoint.
// In a real implementation, forward audio + phrase + nonce to FastAPI for:
// - ASR phrase check
// - Liveness/spoof detection
// - Voiceprint match with cancelable template
export async function POST(req: Request) {
  // consume form data for realism
  const form = await req.formData()
  const phrase = form.get("phrase")
  const nonce = form.get("nonce")
  const audio = form.get("audio")
  const ok = Boolean(phrase && nonce && audio)
  // Simulate short processing time
  await new Promise((r) => setTimeout(r, 400))
  return NextResponse.json({ ok, score: 0.992, pqc: "hybrid" })
}
