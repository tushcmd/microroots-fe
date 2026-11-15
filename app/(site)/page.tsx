import Link from "next/link"
import {
  ArrowRight,
  CalendarClock,
  ChefHat,
  MessageCircle,
  ShieldCheck,
  Sprout,
  Truck,
} from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { ProductCard } from "@/components/site/product-card"
import { ProductGlyph, accentPanel } from "@/components/site/product-visual"
import { getFeaturedProducts, getProduct } from "@/lib/catalog"
import { getThisWeekHarvest } from "@/lib/harvest"
import { site, whatsappLink } from "@/lib/site"
import { cn } from "@/lib/utils"

export default function HomePage() {
  const featured = getFeaturedProducts(3)
  const hero = getProduct("chefs-blend") ?? featured[0]
  const harvest = getThisWeekHarvest()

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/70">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 right-0 -z-10 size-[34rem] rounded-full bg-primary/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-24 -z-10 size-[26rem] rounded-full bg-emerald-300/20 blur-3xl dark:bg-emerald-900/20"
        />

        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Sprout className="size-3.5" aria-hidden="true" />
              Nairobi-grown · Harvested to order
            </p>
            <h1 className="mt-5 text-4xl font-medium tracking-tight text-balance sm:text-5xl">
              Fresh microgreens, grown in Nairobi and delivered to your door.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Cut-to-order microgreens and living trays from our controlled grow rooms. Order by
              Tuesday, harvest by Wednesday, and eat the freshest greens in the city — no cold
              storage, no long supply chain.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link href="/shop" className={buttonVariants({ size: "lg" })}>
                Shop Fresh Harvest
                <ArrowRight aria-hidden="true" />
              </Link>
              <Link
                href="/harvest-club"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
              >
                Explore Chef Subscriptions
              </Link>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Cut &amp; packed · Living trays · Free Nairobi delivery over KES 2,500
            </p>
          </div>

          {hero && (
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-gradient-to-br from-primary/20 via-emerald-200/30 to-lime-100/40 blur-2xl dark:from-primary/20 dark:via-emerald-900/20 dark:to-transparent"
              />
              <div className="overflow-hidden rounded-3xl bg-card ring-1 ring-foreground/10 shadow-xl shadow-primary/5">
                <div
                  className={cn(
                    "relative flex h-44 items-center justify-center",
                    accentPanel[hero.accent],
                  )}
                >
                  {hero.badge && (
                    <span className="absolute top-4 left-4 rounded-full bg-background/85 px-3 py-1 text-[11px] font-medium shadow-sm backdrop-blur">
                      {hero.badge}
                    </span>
                  )}
                  <ProductGlyph
                    icon={hero.icon}
                    accent={hero.accent}
                    iconClassName="size-20"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-lg font-medium tracking-tight">{hero.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{hero.tagline}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {hero.flavour.map((note) => (
                      <span
                        key={note}
                        className="rounded-md bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-base font-medium">
                        KES {hero.priceKes.toLocaleString()}
                      </p>
                      <p className="text-[11px] text-muted-foreground">{hero.unitLabel}</p>
                    </div>
                    <a
                      href={whatsappLink(
                        `Hi MicroRootsKe! I'd like to order the ${hero.name} (${hero.unitLabel}).`,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={buttonVariants()}
                    >
                      <MessageCircle aria-hidden="true" />
                      Order on WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Trust badges */}
      <section className="border-b border-border/70 bg-background">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {[
            { icon: Sprout, title: "Harvested to order", body: "Cut fresh after you order, never warehoused." },
            { icon: ShieldCheck, title: "Indoor grown", body: "Pesticide-free, in controlled grow rooms." },
            { icon: Truck, title: "Nairobi delivery", body: "Weekly routes, or collect at the farm gate." },
            { icon: ChefHat, title: "Chef trusted", body: "Curated for Nairobi kitchens and home cooks." },
          ].map((badge) => (
            <div key={badge.title} className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <badge.icon className="size-4.5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-medium">{badge.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  {badge.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured varieties */}
      <section className="border-b border-border/70">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-primary">This week’s favourites</p>
              <h2 className="mt-3 text-2xl font-medium tracking-tight sm:text-3xl">
                Fresh varieties, ready to order
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                A taste of what’s growing now. Every order is cut to order and delivered on your
                area’s delivery day.
              </p>
            </div>
            <Link
              href="/shop"
              className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Shop all varieties
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-border/70 bg-muted/20">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-primary">How it works</p>
            <h2 className="mt-3 text-2xl font-medium tracking-tight sm:text-3xl">
              From our grow room to your kitchen in days
            </h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              {
                step: "01",
                icon: Sprout,
                title: "Choose your greens",
                body: "Shop cut-to-order microgreens and living trays, or build a Harvest Club box for regular delivery.",
              },
              {
                step: "02",
                icon: CalendarClock,
                title: "We harvest fresh",
                body: "Your order is cut in our grow rooms within a day of dispatch — never sitting on a shelf.",
              },
              {
                step: "03",
                icon: Truck,
                title: "Delivered to your door",
                body: "Chilled, packed, and delivered on your area’s delivery day, or ready for farm-gate pickup.",
              },
            ].map((item) => (
              <div key={item.step} className="rounded-xl bg-card p-5 ring-1 ring-foreground/10">
                <div className="flex items-center justify-between">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <item.icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">{item.step}</span>
                </div>
                <h3 className="mt-4 text-base font-medium">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fresh this week */}
      <section className="border-b border-border/70">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-primary">Fresh this week</p>
              <h2 className="mt-3 text-2xl font-medium tracking-tight sm:text-3xl">
                What’s being harvested now
              </h2>
            </div>
            <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/60" />
                <span className="relative inline-flex size-2.5 rounded-full bg-primary" />
              </span>
              Live from the grow rooms
            </span>
          </div>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {harvest.map((item) => (
              <li
                key={item.name}
                className="flex items-center justify-between gap-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10"
              >
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.growRoom} · {item.timing}
                  </p>
                </div>
                <span className="shrink-0 rounded-md bg-primary/10 px-2 py-1 text-[11px] font-medium text-primary">
                  {item.available}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Audience callouts */}
      <section className="border-b border-border/70 bg-muted/20">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-16 sm:px-6 sm:py-20 md:grid-cols-2">
          <div className="flex flex-col rounded-xl bg-card p-6 ring-1 ring-foreground/10 sm:p-8">
            <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ChefHat className="size-5" aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-xl font-medium tracking-tight">For chefs &amp; kitchens</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
              Consistent, chef-grade supply with harvest timed around your service. Tiered
              wholesale pricing, standing orders, and invoicing for Nairobi kitchens.
            </p>
            <Link
              href="/wholesale"
              className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Wholesale &amp; chef programme
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="flex flex-col rounded-xl bg-card p-6 ring-1 ring-foreground/10 sm:p-8">
            <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Sprout className="size-5" aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-xl font-medium tracking-tight">Harvest Club</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
              A rotating box of the week’s best microgreens, delivered on a schedule you choose.
              Build your box, set your frequency, and pause or skip anytime.
            </p>
            <Link
              href="/harvest-club"
              className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Explore Harvest Club
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section>
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="relative overflow-hidden rounded-2xl bg-primary px-6 py-12 text-center text-primary-foreground sm:px-12 sm:py-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-16 -right-10 size-64 rounded-full bg-white/10 blur-2xl"
            />
            <h2 className="mx-auto max-w-2xl text-2xl font-medium tracking-tight text-balance sm:text-3xl">
              Ready for the freshest greens in Nairobi?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-primary-foreground/80 sm:text-base">
              Order cut-to-order microgreens for delivery this week, or ask us about a Harvest
              Club subscription.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/shop"
                className={cn(
                  buttonVariants({
                    variant: "secondary",
                    size: "lg",
                    className: "bg-background text-foreground hover:bg-background/90",
                  }),
                )}
              >
                Shop Fresh Harvest
              </Link>
              <a
                href={whatsappLink("Hi MicroRootsKe! I'd like to place an order.")}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({
                    variant: "outline",
                    size: "lg",
                    className:
                      "border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground",
                  }),
                )}
              >
                <MessageCircle aria-hidden="true" />
                Order on WhatsApp
              </a>
            </div>
            <p className="mt-6 text-xs text-primary-foreground/70">
              Questions? {site.contact.whatsappDisplay} · {site.contact.hours}
            </p>
          </div>
        </div>
      </section>
    </>
  )
}