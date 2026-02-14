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
  "remember",
  "think about",
  "imagine",
  "picture",
  "miss",
  "love",
  "dream of",
  "believe in",
  "hold onto",
  "trust",
]

const subjects = [
  "that summer morning",
  "the old coffee shop",
  "my first win",
  "quiet moments alone",
  "midnight conversations",
  "the place I felt home",
  "late night drives",
  "old songs we shared",
  "rainy Sunday afternoons",
  "the person I want to be",
]

const linkers = ["when", "where", "because", "even if", "as if"]

const conditions = [
  "everything was simple",
  "the world was still",
  "I felt truly alive",
  "nothing else mattered",
  "time stood still",
  "I was completely myself",
  "everything made sense",
  "I could breathe easy",
]

const actions = [
  "and know I'm exactly where I need to be",
  "and feel grateful for it all",
  "and believe things will work out",
  "and trust myself again",
  "and remember why it matters",
  "and move forward stronger",
]

const secondSubjects = [
  "person I want to become",
  "life I'm building",
  "dreams I'm chasing",
  "strength I carry",
  "journey I'm on",
  "future I believe in",
]

// Function to maybe add an adjective to a phrase
function maybeAdjective() {
  const adjectives = [""]
  return ""
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
