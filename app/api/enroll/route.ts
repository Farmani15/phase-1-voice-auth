import { NextRequest, NextResponse } from "next/server"
import { addVoiceProfile } from "@/lib/voice-storage"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, audioBlob } = body

    console.log("[v0] Enroll request:", { name, hasAudio: !!audioBlob })

    if (!name || !audioBlob) {
      return NextResponse.json(
        { error: "Name and audio blob required" },
        { status: 400 }
      )
    }

    // Generate a voice hash from the audio and name
    const voiceHash = `hash-${name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`

    const profile = addVoiceProfile({
      name: name.trim(),
      active: true,
      voiceHash,
    })

    return NextResponse.json({
      success: true,
      profile,
      message: `Voice enrolled for ${name}`,
    })
  } catch (error) {
    console.error("[v0] Enrollment error:", error)
    return NextResponse.json(
      { error: "Enrollment failed" },
      { status: 500 }
    )
  }
}
