"use client"

import { useEffect, useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
import { addProductCategory, deleteProductCategory, getAllProductCategories } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { displayText } from "@/lib/display"
import { notifyError } from "@/lib/notify"
import type { ProductCategory } from "@/lib/types"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"

export function CategoriesPanel() {
  const { session } = useAuth()
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState<ProductCategory | null>(null)

  function refresh() {
    if (!session) return
    getAllProductCategories()
      .then((data) => setCategories(data as ProductCategory[]))
      .catch(() => setCategories([]))
  }

  useEffect(refresh, [session])

  async function handleCreate() {
    if (!session) return
    setLoading(true)
    try {
      await addProductCategory({ category_name: name, description })
      toast.success("Category added")
      setOpen(false)
      setName("")
      setDescription("")
      refresh()
    } catch (e) {
      notifyError(e, "Couldn't create the category.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-border/70 shadow-none">
      <CardContent className="flex flex-col gap-4 p-4">
        <div className="flex justify-end">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button size="sm" />}>
              <Plus data-icon="inline-start" /> Add category
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add product category</DialogTitle>
                <DialogDescription>Categories group products in the catalog.</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4 py-4">
                <div className="flex flex-col gap-2">
                  <Label>Category name</Label>
                  <Input placeholder="e.g. Microgreens" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Description</Label>
                  <Input
                    placeholder="Short description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate} disabled={loading || !name}>
                  {loading ? "Adding…" : "Add category"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-col divide-y">
          {categories.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">No categories yet.</p>
          )}
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium">{displayText(cat.category_name)}</p>
                <p className="text-xs text-muted-foreground">{displayText(cat.category_description)}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setDeleting(cat)}>
                <Trash2 className="size-4 text-muted-foreground" />
              </Button>
            </div>
          ))}
        </div>

        <ConfirmDialog
          open={!!deleting}
          onOpenChange={(open) => !open && setDeleting(null)}
          title={`Delete "${deleting?.category_name ?? "category"}"?`}
          description="Products in this category may be affected."
          onConfirm={async () => {
            if (!session || !deleting) return
            await deleteProductCategory(deleting.id)
            toast.success("Category deleted")
            refresh()
          }}
        />
      </CardContent>
    </Card>
  )
}
