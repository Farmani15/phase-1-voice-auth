import { NextResponse } from "next/server"

// In-memory voice profiles (shared with /api/enroll)
const voiceProfiles: {
  id: string
  name: string
  enrolledAt: string
  active: boolean
  voiceHash?: string
}[] = [
  {
    id: "voice-001",
    name: "Alex Morgan",
    enrolledAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    active: true,
    voiceHash: "hash-alex-001",
  },
  {
    id: "voice-002",
    name: "Jordan Taylor",
    enrolledAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    active: true,
    voiceHash: "hash-jordan-001",
  },
  {
    id: "voice-003",
    name: "Casey Chen",
    enrolledAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    active: true,
    voiceHash: "hash-casey-001",
  },
]

// Placeholder verification endpoint.
// In a real implementation, forward audio + phrase + nonce to FastAPI for:
// - ASR phrase check
// - Liveness/spoof detection
// - Voiceprint match with cancelable template against registered voiceHash
export async function POST(req: Request) {
  const form = await req.formData()
  const phrase = form.get("phrase")
  const nonce = form.get("nonce")
  const audio = form.get("audio")
  const voiceId = form.get("voiceId") // Which enrolled voice to verify

  // All required fields must be present
  const hasAllFields = Boolean(phrase && nonce && audio && voiceId)
  
  if (!hasAllFields) {
    return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 })
  }

  // Check if the voice profile exists and is active
  const voiceProfile = voiceProfiles.find((v) => v.id === voiceId && v.active)
  if (!voiceProfile) {
    return NextResponse.json({ ok: false, error: "Voice profile not found or inactive" }, { status: 400 })
  }

  // Simulate short processing time
  await new Promise((r) => setTimeout(r, 400))
  
  // In a real implementation, compare audio against voiceProfile.voiceHash
  // For now, simulate successful verification with high confidence
  return NextResponse.json({ 
    ok: true, 
    score: 0.992, 
    voiceId,
    voiceName: voiceProfile.name,
    message: `Verified as ${voiceProfile.name}`,
  })
}
