import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
              {purchases.map((purchase) => (
                <TableRow key={purchase.id}>
                  <TableCell className="font-medium">{purchase.product_name}</TableCell>
                  <TableCell>{purchase.quantity}</TableCell>
                  <TableCell>KES {purchase.stock_price_per_unit.toLocaleString()}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {purchase.stock_batch_number}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{purchase.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
