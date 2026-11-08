"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addStockPurchase } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { displayText } from "@/lib/display"
import type { Product } from "@/lib/types"

export function RecordPurchaseDialog({
  products,
  onRecorded,
}: {
  products: Product[]
  onRecorded?: () => void
}) {
  const { session } = useAuth()
  const [open, setOpen] = useState(false)
  const [productId, setProductId] = useState("")
  const [quantity, setQuantity] = useState("")
  const [unitCost, setUnitCost] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit() {
    if (!session) return
    setLoading(true)
    setError("")
    try {
      await addStockPurchase(
        { product_id: Number(productId), quantity, stock_price_per_unit: unitCost },
        session.token,
      )
      setOpen(false)
      setProductId("")
      setQuantity("")
      setUnitCost("")
      onRecorded?.()
    } catch {
      setError("Couldn't record the purchase. Check the fields and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus data-icon="inline-start" /> Record purchase
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record stock purchase</DialogTitle>
          <DialogDescription>
            Increase available stock and capture its purchase cost.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label>Product</Label>
            <Select value={productId} onValueChange={(v) => setProductId(v ?? "")}>
              <SelectTrigger>
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={String(product.id)}>
                    {displayText(product.product_name)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>Quantity</Label>
              <Input type="number" placeholder="50" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Unit cost (KES)</Label>
              <Input type="number" placeholder="560" value={unitCost} onChange={(e) => setUnitCost(e.target.value)} />
            </div>
          </div>
          {error && <p className="text-sm font-medium text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading || !productId || !quantity || !unitCost}>
            {loading ? "Recording…" : "Record purchase"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
