"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { editStockPurchase } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { displayText } from "@/lib/display"
import { notifyError } from "@/lib/notify"
import type { Product, StockPurchase } from "@/lib/types"

function EditPurchaseForm({
  purchase,
  products,
  onClose,
  onSaved,
}: {
  purchase: StockPurchase
  products: Product[]
  onClose: () => void
  onSaved: () => void
}) {
  const { session } = useAuth()
  const match = products.find((p) => p.product_name === purchase.product_name)?.id
  const initialId = purchase.product_id ?? match
  const [productId, setProductId] = useState(initialId != null ? String(initialId) : "")
  const [quantity, setQuantity] = useState(purchase.quantity != null ? String(purchase.quantity) : "")
  const [unitCost, setUnitCost] = useState(purchase.stock_price_per_unit != null ? String(purchase.stock_price_per_unit) : "")
  const [loading, setLoading] = useState(false)

  async function save() {
    if (!session) return
    setLoading(true)
    try {
      await editStockPurchase({
        stock_purchase_inventory_id: purchase.id,
        product_id: Number(productId),
        quantity,
        stock_price_per_unit: unitCost,
      })
      toast.success("Purchase updated")
      onSaved()
      onClose()
    } catch (e) {
      notifyError(e, "Couldn't save the purchase.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex flex-col gap-4 py-4">
        <div className="flex flex-col gap-2">
          <Label>Product</Label>
          <Select value={productId || undefined} onValueChange={(v) => setProductId(v ?? "")}>
            <SelectTrigger><SelectValue placeholder="Select a product" /></SelectTrigger>
            <SelectContent>
              {products.map((p) => (
                <SelectItem key={p.id} value={String(p.id)}>{displayText(p.product_name)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label>Quantity</Label>
            <Input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Unit cost (KES)</Label>
            <Input type="number" value={unitCost} onChange={(e) => setUnitCost(e.target.value)} />
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={save} disabled={loading || !productId || !quantity || !unitCost}>
          {loading ? "Saving…" : "Save changes"}
        </Button>
      </DialogFooter>
    </>
  )
}

export function EditPurchaseDialog({
  purchase,
  products,
  onClose,
  onSaved,
}: {
  purchase: StockPurchase | null
  products: Product[]
  onClose: () => void
  onSaved: () => void
}) {
  return (
    <Dialog open={!!purchase} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit stock purchase</DialogTitle>
          <DialogDescription>
            The backend does not recalculate available quantity when a purchase is edited. Fix stock by deleting
            and re-recording the purchase instead.
          </DialogDescription>
        </DialogHeader>
        {purchase && (
          <EditPurchaseForm key={purchase.id} purchase={purchase} products={products} onClose={onClose} onSaved={onSaved} />
        )}
      </DialogContent>
    </Dialog>
  )
}
