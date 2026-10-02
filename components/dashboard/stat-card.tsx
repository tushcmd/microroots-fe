import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function StatCard({
  icon: Icon,
  label,
  value,
  detail,
  tone = "green",
}: {
  icon: LucideIcon
  label: string
  value: string
  detail: string
  tone?: "green" | "amber" | "blue"
}) {
  const toneClass =
    tone === "amber"
      ? "bg-amber-50 text-amber-700"
      : tone === "blue"
        ? "bg-blue-50 text-blue-700"
        : "bg-primary/10 text-primary"

  return (
    <Card className="border-border/70 shadow-none">
      <CardContent className="flex items-start justify-between p-5">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
          <p className="mt-2 text-xs text-muted-foreground">{detail}</p>
        </div>
        <div className={`flex size-10 items-center justify-center rounded-lg ${toneClass}`}>
          <Icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  )
}
