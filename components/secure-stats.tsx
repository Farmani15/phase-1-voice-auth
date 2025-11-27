export function SecureStats() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard label="Last Login" value={new Date().toLocaleString()} pill="TOTP synced" />
    </div>
  )
}

function StatCard({ label, value, pill }: { label: string; value: string; pill?: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{label}</p>
        {pill ? (
          <span className="rounded-full border border-white/10 bg-black/30 px-2 py-0.5 text-[10px]">{pill}</span>
        ) : null}
      </div>
      <div className="mt-2 text-pretty text-sm font-medium">{value}</div>
    </div>
  )
}
