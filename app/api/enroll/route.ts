import { NextRequest, NextResponse } from "next/server"

// In-memory storage for voice profiles (name, timestamp, active status)
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, audioBlob } = body

    if (!name || !audioBlob) {
      return NextResponse.json(
        { error: "Name and audio blob required" },
        { status: 400 }
      )
    }

    // Generate a simple hash for the voice
    const voiceHash = `hash-${name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`

    const newVoiceProfile = {
      id: `voice-${Date.now()}`,
      name: name.trim(),
      enrolledAt: new Date().toISOString(),
      active: true,
      voiceHash,
    }

    voiceProfiles.push(newVoiceProfile)

    return NextResponse.json({
      success: true,
      profile: newVoiceProfile,
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
