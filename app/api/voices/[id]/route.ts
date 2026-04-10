import { NextRequest, NextResponse } from "next/server"

// Mock data for deletion/update
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { error: "Voice ID required" },
        { status: 400 }
      )
    }

    // In a real app, delete from database
    console.log(`[v0] Deleting voice profile: ${id}`)

    return NextResponse.json({
      success: true,
      message: `Voice profile ${id} deleted`,
    })
  } catch (error) {
    console.error("[v0] Delete voice error:", error)
    return NextResponse.json(
      { error: "Failed to delete voice" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { active, name } = body

    if (!id) {
      return NextResponse.json(
        { error: "Voice ID required" },
        { status: 400 }
      )
    }

    // In a real app, update database
    console.log(`[v0] Updating voice profile: ${id}`, { active, name })

    return NextResponse.json({
      success: true,
      message: `Voice profile ${id} updated`,
      updated: { id, active, name },
    })
  } catch (error) {
    console.error("[v0] Update voice error:", error)
    return NextResponse.json(
      { error: "Failed to update voice" },
      { status: 500 }
    )
  }
}
