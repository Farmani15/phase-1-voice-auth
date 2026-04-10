// Shared voice profile storage for enroll and verify
export interface VoiceProfile {
  id: string
  name: string
  enrolledAt: string
  active: boolean
  voiceHash: string
}

// Persistent in-memory storage shared across API routes
let voiceProfiles: VoiceProfile[] = [
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

export function getVoiceProfiles(): VoiceProfile[] {
  return voiceProfiles
}

export function addVoiceProfile(profile: Omit<VoiceProfile, "id" | "enrolledAt">): VoiceProfile {
  const newProfile: VoiceProfile = {
    id: `voice-${Date.now()}`,
    name: profile.name,
    enrolledAt: new Date().toISOString(),
    active: profile.active,
    voiceHash: profile.voiceHash,
  }
  voiceProfiles.push(newProfile)
  console.log("[v0] Voice profile added:", newProfile)
  return newProfile
}

export function getVoiceProfileById(id: string): VoiceProfile | undefined {
  return voiceProfiles.find((v) => v.id === id)
}

export function updateVoiceProfile(id: string, updates: Partial<VoiceProfile>): VoiceProfile | undefined {
  const index = voiceProfiles.findIndex((v) => v.id === id)
  if (index === -1) return undefined
  voiceProfiles[index] = { ...voiceProfiles[index], ...updates }
  return voiceProfiles[index]
}

export function deleteVoiceProfile(id: string): boolean {
  const index = voiceProfiles.findIndex((v) => v.id === id)
  if (index === -1) return false
  voiceProfiles.splice(index, 1)
  console.log("[v0] Voice profile deleted:", id)
  return true
}
