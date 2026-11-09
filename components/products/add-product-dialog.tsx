"use client"

import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"
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
import { addProduct, getAllProductCategories } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { displayText } from "@/lib/display"
import { notifyError } from "@/lib/notify"
import { DISCOUNT_TYPE, UNIT_OF_MEASUREMENT, type ProductCategory } from "@/lib/types"

const emptyForm = {
  product_category_id: "",
  supplier_id: "",
  product_name: "",
  unit_of_measurement: "piece",
  minimum_quantity: "",
  retail_price: "",
  discount_type: "not_selected",
  recommended_discount: "0",
  quantity: "",
}

export function AddProductDialog({ onCreated }: { onCreated?: () => void }) {
  const { session } = useAuth()
  const [open, setOpen] = useState(false)
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open || !session) return
    getAllProductCategories(session.token)
      .then((data) => setCategories(data as ProductCategory[]))
      .catch(() => setCategories([]))
  }, [open, session])

  function update<K extends keyof typeof emptyForm>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit() {
    if (!session) return
    setLoading(true)
    try {
      await addProduct(
        {
          product_category_id: Number(form.product_category_id),
          supplier_id: Number(form.supplier_id),
          product_name: form.product_name,
          unit_of_measurement: form.unit_of_measurement,
          minimum_quantity: form.minimum_quantity,
          retail_price: form.retail_price,
          discount_type: form.discount_type,
          recommended_discount: form.recommended_discount,
          quantity: form.quantity,
        },
        session.token,
      )
      toast.success("Product added")
      setOpen(false)
      setForm(emptyForm)
      onCreated?.()
    } catch (e) {
      notifyError(e, "Couldn't add the product. Check the fields and try again.")
    } finally {
      setLoading(false)
    }
  }

  const canSubmit =
    form.product_category_id && form.supplier_id && form.product_name && form.retail_price && form.quantity

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" />}>
        <Plus data-icon="inline-start" /> Add product
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add product</DialogTitle>
          <DialogDescription>Add a new product to your farm catalog.</DialogDescription>
        </DialogHeader>

        <div className="grid max-h-[60vh] gap-4 overflow-y-auto py-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label>Product name</Label>
            <Input
              placeholder="e.g. Radish Microgreens"
              value={form.product_name}
              onChange={(e) => update("product_name", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Category</Label>
            <Select value={form.product_category_id} onValueChange={(v) => update("product_category_id", v ?? "")}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.length === 0 && (
                  <SelectItem value="" disabled>
                    No categories yet
                  </SelectItem>
                )}
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {displayText(cat.category_name)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Supplier ID</Label>
            <Input
              type="number"
              placeholder="e.g. 2"
              value={form.supplier_id}
              onChange={(e) => update("supplier_id", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Unit of measurement</Label>
            <Select value={form.unit_of_measurement} onValueChange={(v) => update("unit_of_measurement", v ?? "piece")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {UNIT_OF_MEASUREMENT.map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Retail price (KES)</Label>
            <Input
              type="number"
              placeholder="450"
              value={form.retail_price}
              onChange={(e) => update("retail_price", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Opening quantity</Label>
            <Input
              type="number"
              placeholder="0"
              value={form.quantity}
              onChange={(e) => update("quantity", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Minimum quantity</Label>
            <Input
              type="number"
              placeholder="20"
              value={form.minimum_quantity}
              onChange={(e) => update("minimum_quantity", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Discount type</Label>
            <Select value={form.discount_type} onValueChange={(v) => update("discount_type", v ?? "not_selected")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DISCOUNT_TYPE.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Recommended discount</Label>
            <Input
              type="number"
              placeholder="0"
              value={form.recommended_discount}
              onChange={(e) => update("recommended_discount", e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading || !canSubmit}>
            {loading ? "Adding…" : "Add product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
