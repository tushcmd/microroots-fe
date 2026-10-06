"use client"

import { useRouter } from "next/navigation"
import { BarChart3, ChevronDown, CircleDollarSign, ClipboardList, Package, ShoppingCart, Sprout, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-contex-no-guard"
import { StatCard } from "./stat-card"

export function DashboardOverview() {
  const { session } = useAuth()
  const router = useRouter()
  const firstName = session?.name.split(" ")[0] ?? "there"

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
        <StatCard icon={Sprout} label="Active batches" value="24" detail="+8.2% from last month" />
        <StatCard icon={CircleDollarSign} label="Low stock alerts" value="07" detail="Requires attention" tone="amber" />
        <StatCard icon={ShoppingCart} label="Pending orders" value="18" detail="KES 42,680 total value" tone="blue" />
        <StatCard icon={BarChart3} label="Today's harvests" value="156 kg" detail="Across 8 active batches" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <Card className="border-border/70 shadow-none">
          <CardHeader>
            <CardTitle className="text-base">Operations overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-52 items-center justify-center rounded-lg border border-dashed bg-muted/20">
              <div className="text-center">
                <ClipboardList className="mx-auto size-8 text-muted-foreground/50" />
                <p className="mt-3 text-sm font-medium text-muted-foreground">
                  Your farm activity will appear here
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Connect your Django API to see live metrics
                </p>
              </div>
            </div>
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
