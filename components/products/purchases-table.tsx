import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { displayText, formatKes } from "@/lib/display"
import type { StockPurchase } from "@/lib/types"

export function PurchasesTable({ purchases }: { purchases: StockPurchase[] }) {
  return (
    <Card className="border-border/70 shadow-none">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit cost</TableHead>
                <TableHead>Stock batch</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchases.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                    No stock purchases yet.
                  </TableCell>
                </TableRow>
              )}
              {purchases.map((purchase) => (
                <TableRow key={purchase.id}>
                  <TableCell className="font-medium">{displayText(purchase.product_name)}</TableCell>
                  <TableCell>{displayText(purchase.quantity)}</TableCell>
                  <TableCell>{formatKes(purchase.stock_price_per_unit)}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {displayText(purchase.stock_batch_number)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{displayText(purchase.date)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}