"use client"

import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type Person = {
  name: string
  role: string
  quote: string
  img: string
  initials: string
}

const people: Person[] = [
  {
    name: "Rhea Tan",
    role: "Red Team Lead",
    quote: "If your voice wavers, the system won’t. Read it clean. Own the phrase.",
    img: "/portrait-security-engineer-asian-female.jpg",
    initials: "RT",
  },
  {
    name: "Malik Cortez",
    role: "Security Engineer",
    quote: "Calm room, steady breath. Deliver with conviction. We verify, fast.",
    img: "/portrait-black-male-engineer.jpg",
    initials: "MC",
  },
  {
    name: "Eva Moreau",
    role: "Fraud Ops",
    quote: "No fuss. One take. If it’s you, it clears. If it’s not, it doesn’t.",
    img: "/portrait-white-female-ops.jpg",
    initials: "EM",
  },
]

export function HumanAvatars() {
  return (
    <section aria-label="Operator feedback" className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <h2 className="text-balance text-center text-2xl font-semibold text-foreground md:text-3xl">
        Trusted by operators
      </h2>
      <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-muted-foreground md:text-base">
        Real people. Real operations. Clear, confident authentication.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {people.map((p) => (
          <motion.figure
            key={p.name}
            whileHover={{ y: -3 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="rounded-lg border bg-card p-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 ring-2 ring-border">
                <AvatarImage src={p.img || "/placeholder.svg"} alt={`${p.name} portrait`} />
                <AvatarFallback className="text-foreground">{p.initials}</AvatarFallback>
              </Avatar>
              <figcaption className="flex-1">
                <div className="text-sm font-medium text-foreground">{p.name}</div>
                <div className="text-xs text-muted-foreground">{p.role}</div>
              </figcaption>
            </div>
            <blockquote className="mt-3 text-pretty text-sm text-muted-foreground">“{p.quote}”</blockquote>
          </motion.figure>
        ))}
      </div>
    </section>
  )
}
