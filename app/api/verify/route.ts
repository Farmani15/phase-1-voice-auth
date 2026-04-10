import { NextResponse } from "next/server"
import { getVoiceProfiles, getVoiceProfileById } from "@/lib/voice-storage"

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

  console.log("[v0] Verify request:", { phrase, nonce, hasAudio: !!audio, voiceId })

  // All required fields must be present
  const hasAllFields = Boolean(phrase && nonce && audio && voiceId)
  
  if (!hasAllFields) {
    return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 })
  }

  // Check if the voice profile exists and is active
  const voiceProfile = getVoiceProfileById(voiceId as string)
  if (!voiceProfile || !voiceProfile.active) {
    console.log("[v0] Voice profile not found or inactive:", voiceId)
    const profiles = getVoiceProfiles()
    console.log("[v0] Available profiles:", profiles.map(p => ({ id: p.id, name: p.name })))
    return NextResponse.json({ ok: false, error: "Voice profile not found or inactive" }, { status: 400 })
  }

  console.log("[v0] Verifying against profile:", voiceProfile.name)

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
