import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { asNumber, displayText, formatKes } from "@/lib/display"
import type { Product } from "@/lib/types"

export function ProductsTable({ products }: { products: Product[] }) {
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
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
                    <TableCell className={low ? "font-semibold text-amber-700" : ""}>
                      {displayText(quantity)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{displayText(minimum)}</TableCell>
                    <TableCell>
                      <Badge variant={low ? "secondary" : "default"}>
                        {low ? "Restock soon" : "Healthy"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
