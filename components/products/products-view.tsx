"use client"

import { useCallback, useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAllProducts, getAllStockPurchases } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import type { Product, StockPurchase } from "@/lib/types"
import { AddProductDialog } from "./add-product-dialog"
import { CategoriesPanel } from "./categories-panel"
import { ProductsTable } from "./products-table"
import { PurchasesTable } from "./purchases-table"
import { RecordPurchaseDialog } from "./record-purchase-dialog"

export function ProductsView() {
  const { session } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [purchases, setPurchases] = useState<StockPurchase[]>([])

  const refreshProducts = useCallback(() => {
    if (!session) return
    getAllProducts(session.token)
      .then((data) => setProducts(data as Product[]))
      .catch(() => setProducts([]))
  }, [session])

  const refreshPurchases = useCallback(() => {
    if (!session) return
    getAllStockPurchases(session.token)
      .then((data) => setPurchases(data as StockPurchase[]))
      .catch(() => setPurchases([]))
  }, [session])

  useEffect(() => {
    refreshProducts()
    refreshPurchases()
  }, [refreshProducts, refreshPurchases])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-muted-foreground">Catalog & stock control</p>
          <h1 className="text-2xl font-semibold tracking-tight">Products & inventory</h1>
        </div>
        <div className="flex gap-2">
          <AddProductDialog onCreated={refreshProducts} />
          <RecordPurchaseDialog products={products} onRecorded={refreshPurchases} />
        </div>
      </div>

      <Tabs defaultValue="products">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="purchases">Stock purchases</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          <ProductsTable products={products} />
        </TabsContent>
        <TabsContent value="purchases">
          <PurchasesTable purchases={purchases} />
        </TabsContent>
        <TabsContent value="categories">
          <CategoriesPanel />
        </TabsContent>
      </Tabs>
    </div>
  )
}
