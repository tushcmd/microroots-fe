import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { asNumber, displayText, formatKes } from "@/lib/display"
import type { StockPurchase } from "@/lib/types"

function formatDay(date: unknown): string {
  if (!date || typeof date !== "string") return "—"
  const parsed = new Date(date)
  return Number.isNaN(parsed.getTime()) ? "—" : String(parsed.getDate()).padStart(2, "0")
}

function formatMonth(date: unknown): string {
  if (!date || typeof date !== "string") return "—"
  const parsed = new Date(date)
  return Number.isNaN(parsed.getTime())
    ? "—"
    : parsed.toLocaleDateString(undefined, { month: "short" })
}

function purchaseDate(p: StockPurchase): unknown {
  return p.date ?? p.created_at ?? p.purchase_date ?? p.createdAt
}

export function RecentActivity({
  purchases,
  loading,
}: {
  purchases: StockPurchase[] | null
  loading: boolean
}) {
  // Sort newest first by date when available; fall back to original order
  const sorted = [...(purchases ?? [])].sort((a, b) => {
    const da = new Date(String(purchaseDate(a) ?? "")).getTime()
    const db = new Date(String(purchaseDate(b) ?? "")).getTime()
    if (Number.isNaN(da) || Number.isNaN(db)) return 0
    return db - da
  })
  const recent = sorted.slice(0, 5)

  return (
    <Card className="border-border/70 shadow-none">
      <CardHeader>
        <CardTitle className="text-base">Recent purchases</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col">
        {loading ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : recent.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">No purchases yet.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {recent.map((purchase) => {
              const qty = asNumber(purchase.quantity)
              const unit = asNumber(purchase.stock_price_per_unit)
              const total = qty != null && unit != null ? qty * unit : null
              const pd = purchaseDate(purchase)
              return (
                <div key={purchase.id} className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 flex-col items-center justify-center rounded-lg bg-muted leading-none">
                    <span className="text-[9px] font-medium uppercase text-muted-foreground">
                      {formatMonth(pd)}
                    </span>
                    <span className="text-sm font-medium">{formatDay(pd)}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{displayText(purchase.product_name)}</p>
                    <p className="text-xs text-muted-foreground">
                      {displayText(purchase.quantity)} units
                      {total != null ? ` · ${formatKes(total)}` : ""}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
        <Link
          href="/products"
          className="mt-5 inline-flex items-center gap-1.5 self-end text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          View all purchases <ArrowRight className="size-4" />
        </Link>
      </CardContent>
    </Card>
  )
}
