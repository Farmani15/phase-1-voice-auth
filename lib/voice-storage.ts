// Shared voice profile storage for enroll and verify
export interface VoiceProfile {
  id: string
  name: string
  enrolledAt: string
  active: boolean
  voiceHash: string
}

const STORAGE_KEY = "voice_profiles_storage"

// Initialize from localStorage if available
function loadFromStorage(): VoiceProfile[] {
  if (typeof window === "undefined") {
    // Server-side: return from sessionStorage or empty array
    return []
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("[v0] Failed to load from localStorage:", error)
    return []
  }
}

// Save to localStorage
function saveToStorage(profiles: VoiceProfile[]): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles))
    console.log("[v0] Saved to localStorage:", profiles.length, "voices")
  } catch (error) {
    console.error("[v0] Failed to save to localStorage:", error)
  }
}

// Persistent storage backed by localStorage
let voiceProfiles: VoiceProfile[] = loadFromStorage()

export function getVoiceProfiles(): VoiceProfile[] {
  // Reload from storage each time to ensure consistency
  voiceProfiles = loadFromStorage()
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
  saveToStorage(voiceProfiles)
  console.log("[v0] Voice profile added:", newProfile)
  return newProfile
}

export function getVoiceProfileById(id: string): VoiceProfile | undefined {
  voiceProfiles = loadFromStorage()
  return voiceProfiles.find((v) => v.id === id)
}

export function updateVoiceProfile(id: string, updates: Partial<VoiceProfile>): VoiceProfile | undefined {
  voiceProfiles = loadFromStorage()
  const index = voiceProfiles.findIndex((v) => v.id === id)
  if (index === -1) return undefined
  voiceProfiles[index] = { ...voiceProfiles[index], ...updates }
  saveToStorage(voiceProfiles)
  return voiceProfiles[index]
}

export function deleteVoiceProfile(id: string): boolean {
  voiceProfiles = loadFromStorage()
  const index = voiceProfiles.findIndex((v) => v.id === id)
  if (index === -1) return false
  voiceProfiles.splice(index, 1)
  saveToStorage(voiceProfiles)
  console.log("[v0] Voice profile deleted:", id)
  return true
}
