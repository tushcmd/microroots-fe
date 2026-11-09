import { PackagePlus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { displayText, formatKes } from "@/lib/display"
import type { StockPurchase } from "@/lib/types"

export function RecentActivity({
  purchases,
  loading,
}: {
  purchases: StockPurchase[] | null
  loading: boolean
}) {
  const recent = (purchases ?? [])
    .slice()
    .sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0
      const dateB = b.date ? new Date(b.date).getTime() : 0
      return dateB - dateA
    })
    .slice(0, 5)

  return (
    <Card className="border-border/70 shadow-none">
      <CardHeader>
        <CardTitle className="text-base">Recent activity</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="py-6 text-center text-sm text-muted-foreground">Loading…</p>
        ) : purchases == null ? (
          <p className="py-6 text-center text-sm text-muted-foreground">Couldn&apos;t load recent purchases.</p>
        ) : recent.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-6 text-center">
            <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <PackagePlus className="size-4" />
            </div>
            <p className="text-sm text-muted-foreground">No stock purchases recorded yet.</p>
          </div>
        ) : (
          <div className="flex flex-col divide-y">
            {recent.map((purchase) => (
              <div key={purchase.id} className="flex items-center gap-3 py-3">
                <div className="flex shrink-0 flex-col items-center justify-center rounded-md border border-border/70 px-2 py-1 text-center leading-none">
                  <span className="text-[10px] font-medium text-muted-foreground uppercase">
                    {formatMonth(purchase.date)}
                  </span>
                  <span className="text-sm font-semibold">{formatDay(purchase.date)}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{displayText(purchase.product_name)}</p>
                  <p className="text-xs text-muted-foreground">
                    {displayText(purchase.quantity)} units · {formatKes(purchase.stock_price_per_unit)} each
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function formatMonth(date: string | null) {
  if (!date) return "—"
  const parsed = new Date(date)
  return Number.isNaN(parsed.getTime()) ? "—" : parsed.toLocaleDateString(undefined, { month: "short" })
}

function formatDay(date: string | null) {
  if (!date) return "—"
  const parsed = new Date(date)
  return Number.isNaN(parsed.getTime()) ? "—" : String(parsed.getDate())
}
