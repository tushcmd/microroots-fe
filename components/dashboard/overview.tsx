"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, ClipboardList, Package, Users, Warehouse } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllProducts, getAllStaffProfiles, getAllStockPurchases } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { asNumber, displayText } from "@/lib/display"
import type { Product, StaffProfile, StockPurchase } from "@/lib/types"
import { StatCard } from "./stat-card"

export function DashboardOverview() {
  const { session } = useAuth()
  const router = useRouter()
  const token = session?.token
  const firstName = session?.name?.split(" ")[0] || "there"

  // null = the request failed (or hasn't finished); [] = loaded but empty
  const [staff, setStaff] = useState<StaffProfile[] | null>(null)
  const [products, setProducts] = useState<Product[] | null>(null)
  const [purchases, setPurchases] = useState<StockPurchase[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return
    let cancelled = false
    // allSettled so one failing endpoint doesn't blank the whole dashboard
    Promise.allSettled([
      getAllStaffProfiles(token),
      getAllProducts(token),
      getAllStockPurchases(token),
    ]).then(([staffRes, productsRes, purchasesRes]) => {
      if (cancelled) return
      setStaff(staffRes.status === "fulfilled" ? (staffRes.value as StaffProfile[]) : null)
      setProducts(productsRes.status === "fulfilled" ? (productsRes.value as Product[]) : null)
      setPurchases(purchasesRes.status === "fulfilled" ? (purchasesRes.value as StockPurchase[]) : null)
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [token])

  const lowStock = useMemo(
    () =>
      (products ?? []).filter((product) => {
        const quantity = asNumber(product.quantity)
        const minimum = asNumber(product.minimum_quantity)
        return quantity != null && minimum != null && quantity < minimum
      }),
    [products],
  )

  const show = (n: number | null) => (loading ? "…" : n == null ? "—" : String(n))
  const failed = (list: unknown[] | null, label: string) =>
    !loading && list == null ? `Couldn't load ${label}` : null

  const activeStaff = staff ? staff.filter((person) => person.is_profile_active).length : null

  return (
    <div className="flex flex-col gap-7">
      <div>
        <p className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Welcome back, {firstName}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening across your farm today.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Users}
          label="Active staff"
          value={show(activeStaff)}
          detail={failed(staff, "staff") ?? `${staff?.length ?? 0} profiles in total`}
        />
        <StatCard
          icon={Package}
          label="Products"
          value={show(products ? products.length : null)}
          detail={failed(products, "products") ?? "In your catalog"}
          tone="blue"
        />
        <StatCard
          icon={Warehouse}
          label="Low stock alerts"
          value={show(products ? lowStock.length : null)}
          detail={
            failed(products, "products") ??
            (lowStock.length ? "Below minimum quantity" : "Everything is stocked")
          }
          tone="amber"
        />
        <StatCard
          icon={ClipboardList}
          label="Stock purchases"
          value={show(purchases ? purchases.length : null)}
          detail={failed(purchases, "purchases") ?? "Recorded so far"}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <Card className="border-border/70 shadow-none">
          <CardHeader>
            <CardTitle className="text-base">Needs restocking</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="py-6 text-center text-sm text-muted-foreground">Loading…</p>
            ) : products == null ? (
              <p className="py-6 text-center text-sm text-muted-foreground">Couldn&apos;t load products.</p>
            ) : lowStock.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No products are below their minimum quantity.
              </p>
            ) : (
              <div className="flex flex-col divide-y">
                {lowStock.slice(0, 6).map((product) => (
                  <div key={product.id} className="flex items-center justify-between py-3">
                    <p className="text-sm font-medium">{displayText(product.product_name)}</p>
                    <p className="text-sm font-semibold text-amber-700">
                      {displayText(asNumber(product.quantity))}
                      <span className="font-normal text-muted-foreground">
                        {" "}
                        / {displayText(asNumber(product.minimum_quantity))} min
                      </span>
                    </p>
                  </div>
                ))}
                {lowStock.length > 6 && (
                  <p className="pt-3 text-xs text-muted-foreground">+{lowStock.length - 6} more in Products</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-none">
          <CardHeader>
            <CardTitle className="text-base">Quick links</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button variant="outline" className="justify-start" onClick={() => router.push("/staff")}>
              <Users data-icon="inline-start" /> Manage staff
              <ChevronDown className="ml-auto -rotate-90" />
            </Button>
            <Button variant="outline" className="justify-start" onClick={() => router.push("/products")}>
              <Package data-icon="inline-start" /> View products
              <ChevronDown className="ml-auto -rotate-90" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}