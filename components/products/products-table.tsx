"use client"

import { useState } from "react"
import { Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { deleteProduct } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { displayText, formatKes } from "@/lib/display"
import type { Product } from "@/lib/types"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { EditProductDialog } from "./edit-product-dialog"

export function ProductsTable({
  products,
  onChanged,
}: {
  products: Product[]
  onChanged: () => void
}) {
  const { session } = useAuth()
  const [editing, setEditing] = useState<Product | null>(null)
  const [deleting, setDeleting] = useState<Product | null>(null)

  return (
    <Card className="overflow-hidden border-border/70 shadow-none">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Retail price</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Minimum</TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                No products yet.
              </TableCell>
            </TableRow>
          )}
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{displayText(product.product_name)}</TableCell>
              <TableCell className="text-muted-foreground">{displayText(product.category)}</TableCell>
              <TableCell>{formatKes(product.retail_price)}</TableCell>
              <TableCell className="capitalize text-muted-foreground">
                {displayText(product.unit_of_measurement)?.replace("_", " ")}
              </TableCell>
              <TableCell className="text-muted-foreground">{displayText(product.minimum_quantity)}</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" aria-label="Edit" onClick={() => setEditing(product)}>
                    <Pencil />
                  </Button>
                  <Button variant="ghost" size="icon" aria-label="Delete" onClick={() => setDeleting(product)}>
                    <Trash2 />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <EditProductDialog product={editing} onClose={() => setEditing(null)} onSaved={onChanged} />
      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Delete product?"
        description={`This will remove ${displayText(deleting?.product_name, "this product")} from the list.`}
        onConfirm={async () => {
          if (!session || !deleting) return
          await deleteProduct(deleting.id, session.token)
          toast.success("Product deleted")
          onChanged()
        }}
      />
    </Card>
  )
}
