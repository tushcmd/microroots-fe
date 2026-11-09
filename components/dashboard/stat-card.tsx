import Link from "next/link"
import { ArrowUpRight, type LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function StatCard({
  icon: Icon,
  label,
  value,
  detail,
  tone = "green",
  href,
}: {
  icon: LucideIcon
  label: string
  value: string
  detail: string
  tone?: "green" | "amber" | "blue" | "rose"
  href?: string
}) {
  const toneClass =
    tone === "amber"
      ? "bg-amber-50 text-amber-700"
      : tone === "blue"
        ? "bg-blue-50 text-blue-700"
        : tone === "rose"
          ? "bg-rose-50 text-rose-700"
          : "bg-primary/10 text-primary"

  const card = (
    <Card
      className={`h-full border-border/70 shadow-none transition-colors ${href ? "group-hover/stat:bg-muted/30" : ""}`}
    >
      <CardContent className="flex items-start justify-between p-5">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
          <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            {detail}
            {href && (
              <ArrowUpRight className="size-3.5 -translate-x-0.5 opacity-0 transition-all group-hover/stat:translate-x-0 group-hover/stat:opacity-100" />
            )}
          </p>
        </div>
        <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${toneClass}`}>
          <Icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  )

  if (!href) return card

  return (
    <Link
      href={href}
      className="group/stat block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
    >
      {card}
    </Link>
  )
}
