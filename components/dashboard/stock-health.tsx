import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function StockHealth({
  loading,
  failed,
  total,
  healthy,
}: {
  loading: boolean
  failed: boolean
  total: number
  healthy: number
}) {
  const percent = total > 0 ? Math.round((healthy / total) * 100) : 0

  return (
    <Card className="border-border/70 shadow-none">
      <CardHeader>
        <CardTitle className="text-base">Stock health</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="py-4 text-center text-sm text-muted-foreground">Loading…</p>
        ) : failed ? (
          <p className="py-4 text-center text-sm text-muted-foreground">Couldn&apos;t load products.</p>
        ) : total === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">No products in your catalog yet.</p>
        ) : (
          <>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-medium tracking-tight">{percent}%</span>
              <span className="text-xs text-muted-foreground">
                {healthy} of {total} well stocked
              </span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-300"
                style={{ width: `${percent}%` }}
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
