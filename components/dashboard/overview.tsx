"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ClipboardList, Package, Users, Warehouse } from "lucide-react"
import { PageHeader, PageRoot } from "@/components/pages/shared/page-chrome"
import { RecordPurchaseDialog } from "@/components/products/record-purchase-dialog"
import { getAllProducts, getAllStaffProfiles, getAllStockPurchases } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { asNumber } from "@/lib/display"
import type { Product, StaffProfile, StockPurchase } from "@/lib/types"
import { PurchasesChart } from "./purchases-chart"
import { QuickActions } from "./quick-actions"
import { RecentActivity } from "./recent-activity"
import { StatCard } from "./stat-card"
import { StockHealth } from "./stock-health"

export function DashboardOverview() {
  const { session } = useAuth()
  const firstName = session?.name?.split(" ")[0] || "there"

  const [staff, setStaff] = useState<StaffProfile[] | null>(null)
  const [products, setProducts] = useState<Product[] | null>(null)
  const [purchases, setPurchases] = useState<StockPurchase[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [productsFailed, setProductsFailed] = useState(false)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const loadAll = useCallback(() => {
    if (!session) return Promise.resolve()
    return Promise.allSettled([
      getAllStaffProfiles(),
      getAllProducts(),
      getAllStockPurchases(),
    ]).then(([s, p, pu]) => {
      if (!mountedRef.current) return
      setStaff(s.status === "fulfilled" ? (s.value as StaffProfile[]) : null)
      if (p.status === "fulfilled") {
        setProducts(p.value as Product[])
        setProductsFailed(false)
      } else {
        setProducts(null)
        setProductsFailed(true)
      }
      setPurchases(pu.status === "fulfilled" ? (pu.value as StockPurchase[]) : null)
      setLoading(false)
    })
  }, [session])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  const stockStats = useMemo(() => {
    if (!products) return { total: 0, healthy: 0, low: 0 }
    let healthy = 0
    let low = 0
    for (const p of products) {
      const avail = asNumber(p.quantity_available ?? p.quantity)
      const min = asNumber(p.minimum_quantity)
      if (avail != null && min != null) {
        if (avail <= min) low++
        else healthy++
      } else {
        healthy++
      }
    }
    return { total: products.length, healthy, low }
  }, [products])

  return (
    <PageRoot>
      <PageHeader
        eyebrow="Overview"
        title={`Good to see you, ${firstName}`}
        description="Here's what's happening across your farm today."
      >
        {products && <RecordPurchaseDialog products={products} onRecorded={loadAll} />}
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Users}
          label="Staff members"
          value={staff ? String(staff.length) : "—"}
          detail={loading ? "Loading…" : staff ? "Active profiles" : "Couldn't load"}
          tone="blue"
          href="/staff"
        />
        <StatCard
          icon={Package}
          label="Products"
          value={products ? String(products.length) : "—"}
          detail={loading ? "Loading…" : products ? "In catalog" : "Couldn't load"}
          tone="green"
          href="/products"
        />
        <StatCard
          icon={ClipboardList}
          label="Stock purchases"
          value={purchases ? String(purchases.length) : "—"}
          detail={loading ? "Loading…" : purchases ? "Records" : "Couldn't load"}
          tone="blue"
          href="/products"
        />
        <StatCard
          icon={Warehouse}
          label="Low stock items"
          value={!loading && products ? String(stockStats.low) : "—"}
          detail={loading ? "Loading…" : stockStats.low > 0 ? "Need restocking" : "All healthy"}
          tone={stockStats.low > 0 ? "amber" : "green"}
          href="/products"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <PurchasesChart purchases={purchases} loading={loading} />
        <div className="flex flex-col gap-6">
          <StockHealth
            loading={loading}
            failed={productsFailed}
            total={stockStats.total}
            healthy={stockStats.healthy}
          />
          <QuickActions />
        </div>
      </div>

      <RecentActivity purchases={purchases} loading={loading} />
    </PageRoot>
  )
}
