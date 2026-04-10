import { NextRequest, NextResponse } from "next/server"
import { getVoiceProfiles } from "@/lib/voice-storage"

export async function GET(request: NextRequest) {
  try {
    const profiles = getVoiceProfiles()
    
    // Sort by enrolledAt descending (most recent first)
    const sorted = [...profiles].sort(
      (a, b) =>
        new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime()
    )

    console.log("[v0] Returning voices:", sorted.map(p => ({ id: p.id, name: p.name })))

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
