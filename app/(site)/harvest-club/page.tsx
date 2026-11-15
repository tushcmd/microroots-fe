import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowRight,
  CalendarDays,
  Leaf,
  PauseCircle,
  Sprout,
  Truck,
} from "lucide-react"
import { PageHero } from "@/components/site/page-hero"
import { BoxBuilder } from "@/components/site/box-builder"
import { buttonVariants } from "@/components/ui/button"
import { site, whatsappLink } from "@/lib/site"

export const metadata: Metadata = {
  title: "Harvest Club",
  description:
    "A rotating box of the week’s best microgreens, delivered on your schedule. Build your Harvest Club box and register your interest.",
}

const features = [
  {
    icon: Sprout,
    title: "The week’s best, boxed",
    body: "Each box is built from what’s freshest that week, so you get variety and peak flavour.",
  },
  {
    icon: CalendarDays,
    title: "On your schedule",
    body: "Weekly, fortnightly or monthly — choose the rhythm that fits how you cook.",
  },
  {
    icon: Truck,
    title: "Delivered on your day",
    body: "We deliver on your area’s delivery day, chilled and ready for the week ahead.",
  },
  {
    icon: PauseCircle,
    title: "Pause or skip anytime",
    body: "Going away or cooking out? Skip a delivery or pause your box — no penalties.",
  },
]

const clubSteps = [
  { step: "01", title: "Build your box", body: "Pick your size, frequency and the varieties you love." },
  { step: "02", title: "Register interest", body: "Tell us where to deliver. No payment is taken yet." },
  { step: "03", title: "We confirm", body: "We confirm your plan, pricing and first delivery date." },
  { step: "04", title: "Enjoy fresh", body: "Your box arrives on schedule, cut for that week." },
]

export default function HarvestClubPage() {
  return (
    <>
      <PageHero eyebrow="Harvest Club" title="Fresh microgreens, on repeat.">
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          A rotating box of the week’s best microgreens, delivered on a schedule you choose. Build
          your box below, pick your rhythm, and register your interest — we’ll confirm the details
          before anything is charged.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a href="#build" className={buttonVariants({ size: "lg" })}>
            Build your box
            <ArrowRight aria-hidden="true" />
          </a>
          <Link href="/shop" className={buttonVariants({ variant: "outline", size: "lg" })}>
            Prefer a one-off? Shop now
          </Link>
        </div>
      </PageHero>

      {/* Features */}
      <section className="border-b border-border/70">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <feature.icon className="size-4.5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-medium">{feature.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  {feature.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-border/70 bg-muted/20">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-primary">How the club works</p>
            <h2 className="mt-3 text-2xl font-medium tracking-tight sm:text-3xl">
              From box-builder to doorstep
            </h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {clubSteps.map((step) => (
              <div key={step.step} className="rounded-xl bg-card p-5 ring-1 ring-foreground/10">
                <span className="font-mono text-xs text-muted-foreground">{step.step}</span>
                <h3 className="mt-3 text-base font-medium">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Box builder */}
      <section id="build" className="scroll-mt-24">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-sm font-medium text-primary">Build your box</p>
            <h2 className="mt-3 text-2xl font-medium tracking-tight sm:text-3xl">
              Design your Harvest Club box
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Choose your box size, how often it arrives, and what goes in it. We’ll show you an
              estimated price per delivery as you go.
            </p>

            <div className="mt-6 space-y-3">
              {[
                "Free delivery over the plan threshold on every box",
                "Cut fresh for each delivery — never pre-packed stock",
                "Skip, pause or cancel anytime before your cut-off",
              ].map((item) => (
                <p key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Leaf className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                  {item}
                </p>
              ))}
            </div>

            <div className="mt-6 rounded-xl bg-muted/30 p-5 ring-1 ring-foreground/10">
              <p className="text-sm font-medium">Questions about the club?</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Message us on WhatsApp at{" "}
                <a
                  href={whatsappLink(`Hi ${site.name}! I'd like to know more about Harvest Club.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-foreground underline underline-offset-2"
                >
                  {site.contact.whatsappDisplay}
                </a>{" "}
                and we’ll help you pick a plan.
              </p>
            </div>
          </div>

          <BoxBuilder />
        </div>
      </section>

      {/* Bottom note */}
      <section className="border-t border-border/70">
        <div className="mx-auto max-w-6xl px-4 py-12 text-center sm:px-6">
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Harvest Club is opening in phases while we grow capacity. Registering your interest
            holds your place — we’ll confirm plans, pricing and the first delivery date with you
            directly, and no payment is taken online.
          </p>
        </div>
      </section>
    </>
  )
}