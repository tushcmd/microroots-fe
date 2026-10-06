"use client"

import { useEffect, useState } from "react"
import { Plus, Trash2 } from "lucide-react"
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
import { useAuth } from "@/lib/auth-contex-no-guard"
import type { ProductCategory } from "@/lib/types"

export function CategoriesPanel() {
  const { session } = useAuth()
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  function refresh() {
    if (!session) return
    getAllProductCategories(session.token)
      .then((data) => setCategories(data as ProductCategory[]))
      .catch(() => {})
  }

  useEffect(refresh, [session])

  async function handleCreate() {
    if (!session) return
    setLoading(true)
    setError("")
    try {
      await addProductCategory({ category_name: name, description }, session.token)
      setOpen(false)
      setName("")
      setDescription("")
      refresh()
    } catch {
      setError("Couldn't create the category.")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: number) {
    if (!session) return
    try {
      await deleteProductCategory(id, session.token)
      refresh()
    } catch {
      // leave the list as-is; the row will still be there to retry
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
                {error && <p className="text-sm font-medium text-destructive">{error}</p>}
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
                <p className="text-sm font-medium">{cat.category_name}</p>
                <p className="text-xs text-muted-foreground">{cat.category_description}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(cat.id)}>
                <Trash2 className="size-4 text-muted-foreground" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
