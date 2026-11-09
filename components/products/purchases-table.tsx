"use client"

import { useState } from "react"
import { Pencil, Trash2 } from "lucide-react"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { deleteStockPurchase } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { displayText, formatKes } from "@/lib/display"
import type { Product, StockPurchase } from "@/lib/types"
import { EditPurchaseDialog } from "./edit-purchase-dialog"

export function PurchasesTable({
  purchases,
  products,
  onChanged,
}: {
  purchases: StockPurchase[]
  products: Product[]
  onChanged: () => void
}) {
  const { session } = useAuth()
  const [editing, setEditing] = useState<StockPurchase | null>(null)
  const [deleting, setDeleting] = useState<StockPurchase | null>(null)

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
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchases.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
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
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" aria-label="Edit purchase" onClick={() => setEditing(purchase)}>
                        <Pencil className="size-4 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" aria-label="Delete purchase" onClick={() => setDeleting(purchase)}>
                        <Trash2 className="size-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <EditPurchaseDialog purchase={editing} products={products} onClose={() => setEditing(null)} onSaved={onChanged} />
      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Delete this stock purchase?"
        description={`This also subtracts ${displayText(deleting?.quantity)} from the product's available quantity.`}
        onConfirm={async () => {
          if (!deleting || !session) return
          await deleteStockPurchase(deleting.id, session.token)
          onChanged()
        }}
      />
    </Card>
  )
}