"use client"

import { useCallback, useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader, PageRoot } from "@/components/pages/shared/page-chrome"
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
    getAllProducts()
      .then((data) => setProducts(data as Product[]))
      .catch(() => setProducts([]))
  }, [session])

  const refreshPurchases = useCallback(() => {
    if (!session) return
    getAllStockPurchases()
      .then((data) => setPurchases(data as StockPurchase[]))
      .catch(() => setPurchases([]))
  }, [session])

  useEffect(() => {
    refreshProducts()
    refreshPurchases()
  }, [refreshProducts, refreshPurchases])

  const refreshAll = useCallback(() => {
    refreshProducts()
    refreshPurchases()
  }, [refreshProducts, refreshPurchases])

  return (
    <PageRoot>
      <PageHeader
        eyebrow="Catalog & stock control"
        title="Products & inventory"
      >
        <AddProductDialog onCreated={refreshProducts} />
        <RecordPurchaseDialog products={products} onRecorded={refreshPurchases} />
      </PageHeader>

      <Tabs defaultValue="products">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="purchases">Stock purchases</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        <TabsContent value="products" className="mt-4">
          <ProductsTable products={products} onChanged={refreshProducts} />
        </TabsContent>
        <TabsContent value="purchases" className="mt-4">
          <PurchasesTable purchases={purchases} products={products} onChanged={refreshAll} />
        </TabsContent>
        <TabsContent value="categories" className="mt-4">
          <CategoriesPanel />
        </TabsContent>
      </Tabs>
    </PageRoot>
  )
}
