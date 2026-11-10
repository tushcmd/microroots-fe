import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Brand } from "@/components/layout/brand"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const navLinks = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#for-kitchens", label: "For kitchens" },
  { href: "#ops", label: "Ops" },
]

const loopSteps = [
  {
    step: "01",
    title: "Grow rooms & trays",
    body: "Microgreens are seeded and raised in controlled-environment grow rooms in Nairobi, tracked tray by tray.",
  },
  {
    step: "02",
    title: "Sensors & conditions",
    body: "IoT monitoring keeps moisture and room conditions visible so issues are spotted early.",
  },
  {
    step: "03",
    title: "Harvest window",
    body: "Harvest timing is planned per tray, with early anomaly flags and timing support where data is available.",
  },
  {
    step: "04",
    title: "Inventory & packing",
    body: "Harvested trays move into stock with clear quantities ready for orders.",
  },
  {
    step: "05",
    title: "Orders & M-Pesa",
    body: "Customer orders are confirmed and recorded alongside payment details, including M-Pesa where used.",
  },
  {
    step: "06",
    title: "Nairobi delivery",
    body: "Packed microgreens go out on delivery routes across Nairobi to kitchens, shops, and households.",
  },
]

const reasons = [
  {
    title: "Fresher cycles",
    body: "Harvest dates, stock, and delivery plans stay close together so microgreens spend less time waiting after cutting.",
  },
  {
    title: "Less waste",
    body: "Tray-level visibility into stock and timing helps match what is grown to what is ordered.",
  },
  {
    title: "Tray health visibility",
    body: "Sensor readings support early anomaly flags and harvest timing, giving growers a clearer view of conditions in each room.",
  },
]

const audiences = [
  {
    title: "Chefs & restaurants",
    body: "Consistent microgreens supply for service, with harvest and delivery coordinated around kitchen needs in Nairobi.",
  },
  {
    title: "Retailers",
    body: "Packed stock and delivery timing aligned to shelf turnover and repeat orders.",
  },
  {
    title: "Households",
    body: "Direct orders of fresh microgreens with clear availability and local delivery.",
  },
]

const opsPanels = [
  { label: "Production", detail: "Trays, rooms, and harvest status" },
  { label: "Inventory", detail: "Stock levels and packed quantities" },
  { label: "Orders", detail: "Customer requests and delivery planning" },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-muted/20 text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4 sm:px-10">
          <Link href="/" className="shrink-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Brand />
          </Link>
          <nav aria-label="Primary" className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <Link href="/login" className={buttonVariants({ variant: "outline", size: "sm" })}>
            Staff login
          </Link>
        </div>
      </header>

      <main id="main">
        <section className="border-b border-border/70 bg-background">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:py-24">
            <div>
              <p className="text-sm font-medium text-primary">Microgreens grown in Nairobi</p>
              <h1 className="mt-4 max-w-3xl text-4xl font-medium tracking-tight text-balance sm:text-5xl">
                Fresh microgreens from Nairobi grow rooms, monitored tray by tray.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                MicroRootsKe runs controlled-environment microgreens production with IoT monitoring, then connects
                harvest timing, inventory, orders, and local delivery in one operation.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link href="/login" className={buttonVariants({ size: "lg" })}>
                  Open operations login
                </Link>
                <a href="#how-it-works" className={buttonVariants({ variant: "outline", size: "lg" })}>
                  See how it works
                </a>
              </div>
              <p className="mt-6 text-sm text-muted-foreground">
                Controlled-environment growing with harvest planned by tray.
              </p>
            </div>

            <Card className="border-border/70 bg-muted/20 shadow-none">
              <CardContent className="p-6 sm:p-7">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  From grow room to delivery
                </p>
                <ol className="mt-5 space-y-4">
                  {[
                    "Trays seeded in controlled grow rooms",
                    "Moisture and conditions monitored",
                    "Harvest windows set by tray",
                    "Stock packed for orders",
                    "Orders confirmed, M-Pesa recorded",
                    "Delivery across Nairobi routes",
                  ].map((item, index) => (
                    <li key={item} className="flex items-start gap-3 text-sm">
                      <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md border border-border/70 bg-background font-mono text-[11px] text-muted-foreground">
                        {index + 1}
                      </span>
                      <span className="leading-relaxed text-foreground/90">{item}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-24">
          <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10 sm:py-20">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-primary">Product in one glance</p>
              <h2 className="mt-3 text-2xl font-medium tracking-tight sm:text-3xl">
                One loop from tray to Nairobi delivery
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Production signals, stock, and orders stay connected so the farm can plan harvests and fulfil deliveries
                with fewer handoffs.
              </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {loopSteps.map((item, index) => (
                <Card key={item.step} className="border-border/70 bg-background shadow-none">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-mono text-xs text-muted-foreground">{item.step}</span>
                      {index < loopSteps.length - 1 ? (
                        <ArrowRight className="size-4 text-muted-foreground/60" aria-hidden="true" />
                      ) : null}
                    </div>
                    <h3 className="mt-4 text-sm font-medium">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border/70 bg-background">
          <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10 sm:py-20">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-primary">Why it matters</p>
              <h2 className="mt-3 text-2xl font-medium tracking-tight sm:text-3xl">
                Operational clarity for a working farm
              </h2>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {reasons.map((item) => (
                <div key={item.title} className="border-t border-border/70 pt-5">
                  <h3 className="text-base font-medium">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="for-kitchens" className="scroll-mt-24">
          <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10 sm:py-20">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-primary">Who it’s for</p>
              <h2 className="mt-3 text-2xl font-medium tracking-tight sm:text-3xl">
                Built around Nairobi supply
              </h2>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {audiences.map((item) => (
                <Card key={item.title} className="border-border/70 bg-background shadow-none">
                  <CardContent className="p-5">
                    <h3 className="text-sm font-medium">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="ops" className="scroll-mt-24 border-t border-border/70 bg-background">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:px-10 sm:py-20 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <p className="text-sm font-medium text-primary">Operations platform</p>
              <h2 className="mt-3 text-2xl font-medium tracking-tight sm:text-3xl">
                Staff run production, stock, and orders in one place
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                The MicroRootsKe operations workspace brings farm records, inventory, staff access, and order activity
                together so day-to-day work stays traceable from tray to delivery.
              </p>
              <div className="mt-7">
                <Link href="/login" className={buttonVariants()}>
                  Go to staff login
                </Link>
              </div>
            </div>

            <Card className="border-border/70 bg-muted/20 shadow-none">
              <CardContent className="p-0">
                <div className="flex items-center justify-between border-b border-border/70 px-5 py-4">
                  <div>
                    <p className="text-sm font-medium">Operations workspace</p>
                    <p className="text-xs text-muted-foreground">Staff view</p>
                  </div>
                  <span className="rounded-md border border-border/70 bg-background px-2 py-1 text-[11px] text-muted-foreground">
                    Nairobi
                  </span>
                </div>
                <div className="space-y-3 p-5">
                  {opsPanels.map((panel) => (
                    <div
                      key={panel.label}
                      className="flex items-center justify-between gap-4 rounded-xl border border-border/70 bg-background px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium">{panel.label}</p>
                        <p className="text-xs text-muted-foreground">{panel.detail}</p>
                      </div>
                      <span className="h-2 w-16 rounded-full bg-primary/15" aria-hidden="true" />
                    </div>
                  ))}
                  <div className="rounded-xl border border-dashed border-border/70 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
                    Sign in to view live production records, stock, and staff tools.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/70">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 sm:px-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Brand />
            <p className="mt-4 text-sm text-muted-foreground">Nairobi, Kenya</p>
            <p className="mt-1 text-sm text-muted-foreground">Contact: details to be added</p>
          </div>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:items-end">
            <Link href="/login" className="transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none">
              Staff login
            </Link>
            <a href="#how-it-works" className="transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none">
              How it works
            </a>
            <p className="pt-2 text-xs text-muted-foreground/80">MicroRootsKe</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
