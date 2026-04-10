// Shared voice profile storage for enroll and verify
export interface VoiceProfile {
  id: string
  name: string
  enrolledAt: string
  active: boolean
  voiceHash: string
}

// Persistent in-memory storage shared across API routes
// Starts empty - only contains voices you actually enroll
let voiceProfiles: VoiceProfile[] = []

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
