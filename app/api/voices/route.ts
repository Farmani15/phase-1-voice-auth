import { NextRequest, NextResponse } from "next/server"

// Mock storage (in production, use a real database)
const voiceProfiles = [
  {
    id: "voice-001",
    name: "Alex Morgan",
    enrolledAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    active: true,
    status: "verified",
  },
  {
    id: "voice-002",
    name: "Jordan Taylor",
    enrolledAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    active: true,
    status: "verified",
  },
  {
    id: "voice-003",
    name: "Casey Chen",
    enrolledAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    active: true,
    status: "enrolled",
  },
  {
    id: "voice-004",
    name: "Sam Rivera",
    enrolledAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    active: true,
    status: "enrolled",
  },
]

export async function GET(request: NextRequest) {
  try {
    // Sort by enrolledAt descending (most recent first)
    const sorted = [...voiceProfiles].sort(
      (a, b) =>
        new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime()
    )

    return NextResponse.json({
      success: true,
      voices: sorted,
      count: sorted.length,
    })
  } catch (error) {
    console.error("[v0] Fetch voices error:", error)
    return NextResponse.json(
      { error: "Failed to fetch voices" },
      { status: 500 }
    )
  }
}
