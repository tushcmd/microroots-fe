"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "cn"
import { asNumber, formatKes } from "@/lib/display"
import type { StockPurchase } from "@/lib/types"

interface DayBucket {
  key: string
  label: string
  quantity: number
  value: number
}

function buildWeek(purchases: StockPurchase[]): DayBucket[] {
  const days: DayBucket[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    days.push({
      key: d.toDateString(),
      label: d.toLocaleDateString(undefined, { weekday: "short" }),
      quantity: 0,
      value: 0,
    })
  }

  const byKey = new Map(days.map((d) => [d.key, d]))
  for (const purchase of purchases) {
    if (!purchase.date) continue
    const parsed = new Date(purchase.date)
    if (Number.isNaN(parsed.getTime())) continue
    const bucket = byKey.get(parsed.toDateString())
    if (!bucket) continue
    const quantity = asNumber(purchase.quantity) ?? 0
    const unitCost = asNumber(purchase.stock_price_per_unit) ?? 0
    bucket.quantity += quantity
    bucket.value += quantity * unitCost
  }

  return days
}

export function PurchasesChart({
  purchases,
  loading,
}: {
  purchases: StockPurchase[] | null
  loading: boolean
}) {
  const [view, setView] = useState<"chart" | "table">("chart")
  const week = buildWeek(purchases ?? [])
  const max = Math.max(1, ...week.map((d) => d.quantity))
  const hasData = week.some((d) => d.quantity > 0)

  return (
    <Card className="border-border/70 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Stock purchases this week</CardTitle>
        <div className="flex items-center gap-[3px] rounded-lg bg-muted p-[3px] text-xs font-medium">
          {(["chart", "table"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setView(option)}
              className={cn(
                "rounded-md px-2.5 py-1 capitalize transition-colors",
                view === option
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="py-10 text-center text-sm text-muted-foreground">Loading…</p>
        ) : !hasData ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No stock purchases recorded this week.
          </p>
        ) : view === "chart" ? (
          <ChartBody week={week} max={max} />
        ) : (
          <TablePanel week={week} />
        )}
      </CardContent>
    </Card>
  )
}

function ChartBody({ week, max }: { week: DayBucket[]; max: number }) {
  return (
    <div className="px-1 pt-2">
      <div className="relative flex h-40 items-end justify-between gap-2 border-b border-border/70">
        {/* hairline guide lines */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex h-full flex-col justify-between">
          <div className="border-t border-dashed border-border/50" />
          <div className="border-t border-dashed border-border/50" />
          <div className="border-t border-dashed border-border/50" />
          <div className="h-0" />
        </div>
        {week.map((day) => (
          <div key={day.key} className="relative flex h-full flex-1 flex-col items-center justify-end gap-2">
            <div
              title={`${day.label}: ${day.quantity} units · ${formatKes(day.value)}`}
              className="w-full max-w-9 rounded-t-md bg-primary/80 transition-[height] duration-200 hover:bg-primary"
              style={{ height: `${Math.max(4, (day.quantity / max) * 100)}%` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between gap-2">
        {week.map((day) => (
          <span key={day.key} className="flex-1 text-center text-xs text-muted-foreground">
            {day.label}
          </span>
        ))}
      </div>
    </div>
  )
}

function TablePanel({ week }: { week: DayBucket[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Day</TableHead>
          <TableHead>Units purchased</TableHead>
          <TableHead>Cost</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {week.map((day) => (
          <TableRow key={day.key}>
            <TableCell className="font-medium">{day.label}</TableCell>
            <TableCell>{day.quantity}</TableCell>
            <TableCell className="text-muted-foreground">{formatKes(day.value)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
