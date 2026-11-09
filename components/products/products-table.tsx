"use client"

import { useState } from "react"
import { Pencil, Trash2 } from "lucide-react"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { deleteProduct } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { asNumber, displayText, formatKes } from "@/lib/display"
import type { Product } from "@/lib/types"
import { EditProductDialog } from "./edit-product-dialog"

export function ProductsTable({ products, onChanged }: { products: Product[]; onChanged: () => void }) {
  const { session } = useAuth()
  const [editing, setEditing] = useState<Product | null>(null)
  const [deleting, setDeleting] = useState<Product | null>(null)

  return (
    <Card className="border-border/70 shadow-none">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Retail price</TableHead>
                <TableHead>Available quantity</TableHead>
                <TableHead>Minimum quantity</TableHead>
                <TableHead>Stock status</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                    No products yet.
                  </TableCell>
                </TableRow>
              )}
              {products.map((product) => {
                const quantity = asNumber(product.quantity)
                const minimum = asNumber(product.minimum_quantity)
                const low = quantity != null && minimum != null && quantity < minimum
                return (
                  <TableRow key={product.id} className={low ? "bg-amber-50/60" : ""}>
                    <TableCell className="font-medium">{displayText(product.product_name)}</TableCell>
                    <TableCell className="text-muted-foreground">{displayText(product.category)}</TableCell>
                    <TableCell>{formatKes(product.retail_price)}</TableCell>
                    <TableCell className={low ? "font-semibold text-amber-700" : ""}>{displayText(quantity)}</TableCell>
                    <TableCell className="text-muted-foreground">{displayText(minimum)}</TableCell>
                    <TableCell>
                      <Badge variant={low ? "secondary" : "default"}>{low ? "Restock soon" : "Healthy"}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" aria-label="Edit product" onClick={() => setEditing(product)}>
                          <Pencil className="size-4 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" aria-label="Delete product" onClick={() => setDeleting(product)}>
                          <Trash2 className="size-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <EditProductDialog product={editing} onClose={() => setEditing(null)} onSaved={onChanged} />
      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={`Delete "${deleting?.product_name ?? "product"}"?`}
        description="The product is removed from the catalog and stock lists."
        onConfirm={async () => {
          if (!deleting || !session) return
          await deleteProduct(deleting.id, session.token)
          onChanged()
        }}
      />
    </Card>
  )
}