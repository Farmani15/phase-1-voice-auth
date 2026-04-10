"use client"

import { useState } from "react"
import Link from "next/link"
import { EnrollmentForm } from "@/components/enrollment-form"
import { VoiceList } from "@/components/voice-list"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function EnrollPage() {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Navigation */}
      <div className="border-b border-white/10 bg-white/5 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white">Voice Enrollment</h1>
              <p className="text-xs text-gray-400">Register and manage voice profiles</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Enrollment Form */}
          <div>
            <EnrollmentForm
              onSuccess={() => {
                setRefreshKey((k) => k + 1)
              }}
            />
          </div>

          {/* Voice List */}
          <div key={refreshKey}>
            <VoiceList />
          </div>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-3 gap-4">
          <div className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-md text-center">
            <p className="text-2xl font-bold text-blue-400">4</p>
            <p className="text-xs text-gray-400 mt-1">Voices Enrolled</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-md text-center">
            <p className="text-2xl font-bold text-green-400">2</p>
            <p className="text-xs text-gray-400 mt-1">Verified</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-md text-center">
            <p className="text-2xl font-bold text-yellow-400">99.2%</p>
            <p className="text-xs text-gray-400 mt-1">Match Rate</p>
          </div>
        </div>
      </div>
    </main>
  )
}
