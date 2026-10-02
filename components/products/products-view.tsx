"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAllProducts, getAllStockPurchases } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { mockProducts, mockPurchases } from "@/lib/mock-data"
import type { Product, StockPurchase } from "@/lib/types"
import { AddProductDialog } from "./add-product-dialog"
import { ProductsTable } from "./products-table"
import { PurchasesTable } from "./purchases-table"
import { RecordPurchaseDialog } from "./record-purchase-dialog"

export function ProductsView() {
  const { session } = useAuth()
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [purchases, setPurchases] = useState<StockPurchase[]>(mockPurchases)

  useEffect(() => {
    if (!session) return
    getAllProducts(session.token)
      .then((data) => data.length && setProducts(data as Product[]))
      .catch(() => {})
    getAllStockPurchases(session.token)
      .then((data) => data.length && setPurchases(data as StockPurchase[]))
      .catch(() => {})
  }, [session])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-muted-foreground">Catalog & stock control</p>
          <h1 className="text-2xl font-semibold tracking-tight">Products & inventory</h1>
        </div>
        <div className="flex gap-2">
          <AddProductDialog />
          <RecordPurchaseDialog products={products} />
        </div>
      </div>

      <Tabs defaultValue="products">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="purchases">Stock purchases</TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          <ProductsTable products={products} />
        </TabsContent>
        <TabsContent value="purchases">
          <PurchasesTable purchases={purchases} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
