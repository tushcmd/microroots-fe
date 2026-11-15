import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowRight,
  Droplets,
  Leaf,
  MapPin,
  Recycle,
  ShieldCheck,
  Sprout,
  Sun,
  Thermometer,
  Truck,
  Wind,
} from "lucide-react"
import { PageHero } from "@/components/site/page-hero"
import { buttonVariants } from "@/components/ui/button"
import { site, whatsappLink } from "@/lib/site"

export const metadata: Metadata = {
  title: "Our farm",
  description:
    "How MicroRootsKe grows fresh microgreens in controlled Nairobi grow rooms, with pesticide-free practices and low food miles.",
}

const growingRooms = [
  {
    name: "Grow Room A",
    icon: Sprout,
    caption: "Leafy staples — pea shoots and sunflower.",
    tone: "from-lime-100 via-lime-50 to-emerald-50 dark:from-lime-950/70 dark:via-lime-950/30 dark:to-background",
    iconTone: "text-lime-700/80 dark:text-lime-300/80",
  },
  {
    name: "Grow Room B",
    icon: Leaf,
    caption: "Brassicas — broccoli and radish microgreens.",
    tone: "from-emerald-100 via-emerald-50 to-teal-50 dark:from-emerald-950/70 dark:via-emerald-950/30 dark:to-background",
    iconTone: "text-emerald-700/80 dark:text-emerald-300/80",
  },
  {
    name: "Grow Room C",
    icon: Sun,
    caption: "Blends — where we build our chef mixes.",
    tone: "from-amber-100 via-amber-50 to-yellow-50 dark:from-amber-950/70 dark:via-amber-950/30 dark:to-background",
    iconTone: "text-amber-700/80 dark:text-amber-300/80",
  },
]

const practices = [
  {
    icon: ShieldCheck,
    title: "No pesticides, ever",
    body: "Indoor growing keeps pests out naturally, so we never need synthetic pesticides or herbicides on anything we sell.",
  },
  {
    icon: Droplets,
    title: "Recirculated water",
    body: "Our trays are watered in a closed loop, so the same water is reused rather than drained away after each cycle.",
  },
  {
    icon: Truck,
    title: "Low food miles",
    body: "Grown in the city we deliver to. Most orders travel a handful of kilometres, not across the country or by air.",
  },
  {
    icon: Recycle,
    title: "Living trays, less waste",
    body: "Living trays keep growing after delivery, so you snip what you need and nothing wilts in the fridge.",
  },
]

const stats = [
  { value: "48h", label: "From cut to door" },
  { value: "100%", label: "Pesticide-free" },
  { value: "0", label: "Air-freighted greens" },
  { value: "6", label: "Grow rooms in Nairobi" },
]

const conditions = [
  { icon: Thermometer, label: "Temperature", detail: "Held steady for even germination." },
  { icon: Droplets, label: "Humidity", detail: "Balanced to avoid mould and rot." },
  { icon: Wind, label: "Airflow", detail: "Keeps trays healthy and stems strong." },
  { icon: Sun, label: "Light", detail: "Timed cycles for colour and flavour." },
]

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="Our farm" title="Grown in Nairobi, with obsessive care.">
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          MicroRootsKe is a controlled-environment microgreens farm in Nairobi. We grow fresh,
          pesticide-free greens in small batches, cut them to order, and deliver them across the
          city — so the food on your plate is days fresher than anything flown in.
        </p>
      </PageHero>

      {/* Story */}
      <section className="border-b border-border/70">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <p className="text-sm font-medium text-primary">Why we grow</p>
            <h2 className="mt-3 text-2xl font-medium tracking-tight sm:text-3xl">
              Freshness you can taste, from a farm you can name
            </h2>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>
                Most “fresh” greens travel for days — often by air — before they reach a Nairobi
                kitchen. By then, flavour and nutrients have faded. We built MicroRootsKe to close
                that gap: grow in the city, harvest to order, and deliver within days.
              </p>
              <p>
                Every tray is raised in a controlled grow room where we can see and adjust the
                conditions that shape flavour. We plant in small batches, watch each room daily, and
                cut only what’s been ordered so nothing sits waiting.
              </p>
              <p>
                The result is microgreens with real crunch, colour, and taste — for home cooks,
                chefs, and anyone who wants their food grown close to home.
              </p>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/shop" className={buttonVariants()}>
                Taste the difference
                <ArrowRight aria-hidden="true" />
              </Link>
              <Link href="/contact" className={buttonVariants({ variant: "outline" })}>
                <MapPin aria-hidden="true" />
                Visit or contact us
              </Link>
            </div>
          </div>

          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-gradient-to-br from-primary/20 via-emerald-200/30 to-lime-100/40 blur-2xl dark:from-primary/20 dark:via-emerald-900/20 dark:to-transparent"
            />
            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl bg-card p-5 ring-1 ring-foreground/10"
                >
                  <p className="text-2xl font-medium tracking-tight text-primary">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Growing rooms */}
      <section className="border-b border-border/70 bg-muted/20">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-primary">Inside the farm</p>
            <h2 className="mt-3 text-2xl font-medium tracking-tight sm:text-3xl">
              Six grow rooms, each with its own rhythm
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Each room is tuned for a different crop, so every variety gets the conditions it
              needs rather than a one-size-fits-all space.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {growingRooms.map((room) => (
              <figure
                key={room.name}
                className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10"
              >
                <div
                  className={`flex h-40 items-center justify-center bg-gradient-to-br ${room.tone}`}
                >
                  <room.icon className={`size-12 ${room.iconTone}`} aria-hidden="true" />
                </div>
                <figcaption className="p-4">
                  <p className="text-sm font-medium">{room.name}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {room.caption}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {conditions.map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <item.icon className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability */}
      <section className="border-b border-border/70">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-primary">Sustainability</p>
            <h2 className="mt-3 text-2xl font-medium tracking-tight sm:text-3xl">
              Small footprint, by design
            </h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {practices.map((item) => (
              <div key={item.title} className="border-t border-border/70 pt-5">
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <item.icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-base font-medium">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="relative overflow-hidden rounded-2xl bg-primary px-6 py-12 text-center text-primary-foreground sm:px-12">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-16 -left-10 size-64 rounded-full bg-white/10 blur-2xl"
            />
            <h2 className="mx-auto max-w-2xl text-2xl font-medium tracking-tight text-balance sm:text-3xl">
              Taste what fresh really means
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-primary-foreground/80 sm:text-base">
              Order cut-to-order microgreens for delivery this week, or ask us about the farm.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/shop"
                className={buttonVariants({
                  variant: "secondary",
                  size: "lg",
                  className: "bg-background text-foreground hover:bg-background/90",
                })}
              >
                Shop Fresh Harvest
              </Link>
              <a
                href={whatsappLink(`Hi ${site.name}! I'd like to learn more about the farm.`)}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                  className:
                    "border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground",
                })}
              >
                Ask us on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}