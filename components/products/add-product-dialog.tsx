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

// Wiring note: the live endpoint (POST /products/add-product/) also needs
// product_category_id, supplier_id, unit_of_measurement, discount_type, and
// recommended_discount — none of which have a picker here yet. Add those
// fields (categories come from getAllProductCategories) before calling
// addProduct from lib/api for real.
export function AddProductDialog() {
  const [open, setOpen] = useState(false)

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
        <div className="grid gap-4 py-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label>Product name</Label>
            <Input placeholder="e.g. Radish Microgreens" />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Category</Label>
            <Input placeholder="Microgreens" />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Retail price (KES)</Label>
            <Input type="number" placeholder="450" />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Opening quantity</Label>
            <Input type="number" placeholder="0" />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Minimum quantity</Label>
            <Input type="number" placeholder="20" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>Add product</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
