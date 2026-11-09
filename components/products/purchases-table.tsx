"use client"

import { useState } from "react"
import { Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { deleteStockPurchase } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { asNumber, displayText, formatKes } from "@/lib/display"
import type { Product, StockPurchase } from "@/lib/types"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
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
    <Card className="overflow-hidden border-border/70 shadow-none">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Product</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Unit cost</TableHead>
            <TableHead>Total cost</TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchases.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                No stock purchases yet.
              </TableCell>
            </TableRow>
          )}
          {purchases.map((purchase) => {
            const qty = asNumber(purchase.quantity)
            const unit = asNumber(purchase.stock_price_per_unit)
            const total = qty != null && unit != null ? qty * unit : null
            return (
              <TableRow key={purchase.id}>
                <TableCell className="font-medium">{displayText(purchase.product_name)}</TableCell>
                <TableCell>{displayText(purchase.quantity)}</TableCell>
                <TableCell className="text-muted-foreground">{formatKes(purchase.stock_price_per_unit)}</TableCell>
                <TableCell>{formatKes(total)}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" aria-label="Edit" onClick={() => setEditing(purchase)}>
                      <Pencil />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label="Delete" onClick={() => setDeleting(purchase)}>
                      <Trash2 />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      <EditPurchaseDialog
        purchase={editing}
        products={products}
        onClose={() => setEditing(null)}
        onSaved={onChanged}
      />
      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Delete purchase?"
        description="This removes the purchase record and reverses its quantity in the product's stock."
        onConfirm={async () => {
          if (!session || !deleting) return
          await deleteStockPurchase(deleting.id, session.token)
          toast.success("Purchase deleted")
          onChanged()
        }}
      />
    </Card>
  )
}
