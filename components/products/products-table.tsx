import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
              {products.map((product) => {
                const low = product.quantity < product.minimum_quantity
                return (
                  <TableRow key={product.id} className={low ? "bg-amber-50/60" : ""}>
                    <TableCell className="font-medium">{product.product_name}</TableCell>
                    <TableCell className="text-muted-foreground">{product.category}</TableCell>
                    <TableCell>KES {product.retail_price.toLocaleString()}</TableCell>
                    <TableCell className={low ? "font-semibold text-amber-700" : ""}>
                      {product.quantity}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{product.minimum_quantity}</TableCell>
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
