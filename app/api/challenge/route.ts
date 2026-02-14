import { NextResponse } from "next/server"

// Function to sample an element from an array
function sample<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

// Function to capitalize the first letter of a string
function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

// Arrays of words for phrase generation
const verbs = [
  "check",
  "open",
  "read",
  "pass",
  "say",
  "clear",
  "start",
  "go",
]

const subjects = [
  "blue door",
  "green light",
  "fast track",
  "red line",
  "main gate",
  "new code",
  "open path",
  "clear zone",
]

const linkers = ["in", "on", "at", "for", "with"]

const conditions = [
  "right now",
  "today",
  "fast",
  "clean",
  "clear",
  "smooth",
  "easy",
  "safe",
]

const actions = [
  "then move on",
  "then go forward",
  "then you pass",
  "then all clear",
  "then keep going",
  "then locked in",
]

const secondSubjects = [
  "way forward",
  "next step",
  "clear road",
  "main access",
  "full reach",
  "safe move",
]

// Function to maybe add an adjective to a phrase
function maybeAdjective() {
  const adjectives = ["big", "small", "new", "old", "quick", "slow"]
  return Math.random() < 0.3 ? sample(adjectives) + " " : ""
}

// Function to generate a lively phrase
function generateLivelyPhrase() {
  // Clause 1
  const c1 =
    `${capitalize(sample(verbs))} the ` +
    `${maybeAdjective()}${sample(subjects)} ` +
    `${sample(linkers)} ${sample(conditions)}`
  // Clause 2
  const c2 = `${sample(actions)} ` + `for the ${maybeAdjective()}${sample(secondSubjects)}`
  // Assemble 1–2 clause sentence to reach ~12–20 words
  if (Math.random() < 0.65) {
    return `${c1}, ${c2}.`
  }
  return `${c1}.`
}

export async function GET() {
  // Use lively generator instead of a short static list
  const phrase = generateLivelyPhrase()
  const nonce = Math.random().toString(36).slice(2, 10)
  return NextResponse.json({ phrase, nonce })
}
