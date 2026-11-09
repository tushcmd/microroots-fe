"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { asNumber, formatKes } from "@/lib/display"
import type { StockPurchase } from "@/lib/types"

interface DayBucket {
  key: string
  label: string
  quantity: number
  value: number
}

function purchaseDate(p: StockPurchase): string | undefined {
  return p.date ?? p.created_at ?? p.purchase_date ?? p.createdAt ?? undefined
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
    const dateStr = purchaseDate(purchase)
    if (!dateStr) continue
    const parsed = new Date(dateStr)
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
          <div className="flex h-56 items-end gap-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex-1 animate-pulse rounded-t-md bg-muted" style={{ height: `${30 + i * 8}%` }} />
            ))}
          </div>
        ) : !hasData ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            No stock purchases recorded this week.
          </p>
        ) : view === "chart" ? (
          <div className="flex h-56 items-end gap-2">
            {week.map((day) => (
              <div key={day.key} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-md bg-primary/80 transition-all"
                  style={{ height: `${Math.max(6, (day.quantity / max) * 100)}%` }}
                  title={`${day.quantity} units`}
                />
                <span className="text-[11px] text-muted-foreground">{day.label}</span>
              </div>
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Day</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {week.map((day) => (
                <TableRow key={day.key}>
                  <TableCell>{day.label}</TableCell>
                  <TableCell className="text-right">{day.quantity}</TableCell>
                  <TableCell className="text-right">{formatKes(day.value)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
