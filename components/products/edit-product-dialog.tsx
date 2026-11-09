"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { editProduct, getAllProductCategories } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { displayText } from "@/lib/display"
import { DISCOUNT_TYPE, UNIT_OF_MEASUREMENT, type Product, type ProductCategory } from "@/lib/types"

export function EditProductDialog({
  product,
  onClose,
  onSaved,
}: {
  product: Product | null
  onClose: () => void
  onSaved: () => void
}) {
  const { session } = useAuth()
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [form, setForm] = useState({
    product_category_id: "", supplier_id: "", product_name: "", unit_of_measurement: "piece",
    minimum_quantity: "", retail_price: "", discount_type: "not_selected", recommended_discount: "0",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!product || !session) return
    getAllProductCategories(session.token)
      .then((data) => {
        const list = data as ProductCategory[]
        setCategories(list)
        // fall back to matching by category name if the API doesn't send the id
        const byName = list.find((c) => c.category_name === product.category)?.id
        const catId = product.product_category_id ?? byName
        setForm((f) => ({ ...f, product_category_id: catId != null ? String(catId) : f.product_category_id }))
      })
      .catch(() => setCategories([]))
    setForm((f) => ({
      ...f,
      supplier_id: product.supplier_id != null ? String(product.supplier_id) : "",
      product_name: product.product_name ?? "",
      unit_of_measurement: product.unit_of_measurement ?? "piece",
      minimum_quantity: product.minimum_quantity != null ? String(product.minimum_quantity) : "",
      retail_price: product.retail_price != null ? String(product.retail_price) : "",
      discount_type: product.discount_type ?? "not_selected",
      recommended_discount: product.recommended_discount != null ? String(product.recommended_discount) : "0",
    }))
    setError("")
  }, [product, session])

  const set = (key: keyof typeof form) => (value: string) => setForm((f) => ({ ...f, [key]: value }))

  async function save() {
    if (!session || !product) return
    setLoading(true)
    setError("")
    try {
      await editProduct(
        { product_id: product.id, ...form, product_category_id: Number(form.product_category_id), supplier_id: Number(form.supplier_id) },
        session.token,
      )
      onSaved()
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't save the product.")
    } finally {
      setLoading(false)
    }
  }

  const canSave = form.product_name && form.product_category_id && form.supplier_id && form.retail_price

  return (
    <Dialog open={!!product} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit product</DialogTitle>
          <DialogDescription>Changes details only. Use Record purchase to change stock quantity.</DialogDescription>
        </DialogHeader>
        <div className="grid max-h-[60vh] gap-4 overflow-y-auto py-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label>Product name</Label>
            <Input value={form.product_name} onChange={(e) => set("product_name")(e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Category</Label>
            <Select value={form.product_category_id || undefined} onValueChange={(v) => set("product_category_id")(v ?? "")}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>{displayText(c.category_name)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Supplier ID</Label>
            <Input type="number" value={form.supplier_id} onChange={(e) => set("supplier_id")(e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Unit of measurement</Label>
            <Select value={form.unit_of_measurement} onValueChange={(v) => set("unit_of_measurement")(v ?? "piece")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {UNIT_OF_MEASUREMENT.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Retail price (KES)</Label>
            <Input type="number" value={form.retail_price} onChange={(e) => set("retail_price")(e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Minimum quantity</Label>
            <Input type="number" value={form.minimum_quantity} onChange={(e) => set("minimum_quantity")(e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Discount type</Label>
            <Select value={form.discount_type} onValueChange={(v) => set("discount_type")(v ?? "not_selected")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {DISCOUNT_TYPE.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Recommended discount</Label>
            <Input type="number" value={form.recommended_discount} onChange={(e) => set("recommended_discount")(e.target.value)} />
          </div>
        </div>
        {error && <p className="text-sm font-medium text-destructive">{error}</p>}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={save} disabled={loading || !canSave}>{loading ? "Saving…" : "Save changes"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}