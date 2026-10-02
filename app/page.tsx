import Link from "next/link"
import { CircleDollarSign, Package, ShieldCheck, ShoppingCart, Sprout, Truck } from "lucide-react"
import { Brand } from "@/components/layout/brand"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const modules = [
  { icon: Sprout, title: "Production & batches", body: "Track every tray from seed to harvest, with growth-stage status at a glance." },
  { icon: Package, title: "Inventory", body: "Seed, substrate, and finished-goods stock, with shelf-life on perishables." },
  { icon: ShoppingCart, title: "Sales & orders", body: "Customer orders and M-Pesa payments in one queue." },
  { icon: Truck, title: "Delivery & logistics", body: "Route planning and delivery status for Nairobi drop-offs." },
  { icon: CircleDollarSign, title: "Finance", body: "Invoicing, expenses, and a running P&L." },
  { icon: ShieldCheck, title: "Staff & roles", body: "Permission-based access for farm, sales, and admin teams." },
]

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      <header className="flex items-center justify-between px-6 py-6 sm:px-10">
        <Brand />
        <Link href="/login" className={buttonVariants()}>
          Staff sign in
        </Link>
      </header>

      <section className="mx-auto max-w-3xl px-6 pb-16 pt-10 text-center sm:pt-16">
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Run the whole farm from one screen
        </h1>
        <p className="mt-5 text-balance text-lg text-muted-foreground">
          MicroRootsKe centralises production, inventory, sales, delivery, and finance for a
          Nairobi microgreens operation — one system instead of six spreadsheets.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((item) => {
            const Icon = item.icon
            return (
              <Card key={item.title} className="border-border/70 shadow-none">
                <CardContent className="p-5">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-4" />
                  </div>
                  <h2 className="mt-4 text-sm font-semibold">{item.title}</h2>
                  <p className="mt-1.5 text-sm text-muted-foreground">{item.body}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>
    </main>
  )
}
