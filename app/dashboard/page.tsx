import { SecureStats } from "@/components/secure-stats"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <main className="min-h-[100svh] bg-background text-foreground">
      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
          <header className="mb-6">
            <h1 className="text-2xl font-semibold">Authentication Successful</h1>
            <p className="text-muted-foreground">You’re signed in with quantum-hardened voice authentication.</p>
          </header>
          <SecureStats />
          <div className="mt-6 flex gap-3">
            <Link href="/auth">
              <Button variant="secondary">Re-Verify</Button>
            </Link>
            <Link href="/admin">
              <Button>Admin Panel</Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
