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
  "calibrate",
  "synchronize",
  "stabilize",
  "verify",
  "trace",
  "align",
  "authorize",
  "commit",
  "handshake",
  "harden",
]

const subjects = [
  "liveness signal",
  "voiceprint entropy",
  "quantum channel",
  "acoustic hash",
  "zero-knowledge proof",
  "kyber exchange",
  "dilithium signature",
  "secure enclave",
  "challenge nonce",
  "session key",
]

const linkers = ["within", "against", "through", "under", "inside", "amid", "across"]

const conditions = [
  "adversarial conditions",
  "replay resistance",
  "time drift",
  "low latency",
  "cold start",
  "side-channel noise",
  "packet loss",
  "band-limited input",
]

const actions = [
  "then confirm integrity",
  "then commit and seal",
  "then acknowledge receipt",
  "then lock and proceed",
  "then finalize the exchange",
  "then attest and continue",
]

const secondSubjects = [
  "challenge phrase",
  "nonce binding",
  "session transcript",
  "enclave state",
  "acoustic checksum",
  "proof transcript",
]

// Function to maybe add an adjective to a phrase
function maybeAdjective() {
  const adjectives = ["hardened", "zero-trust", "quantum-safe", "operator-grade", "stealth", "resilient"]
  return Math.random() < 0.5 ? sample(adjectives) + " " : ""
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
