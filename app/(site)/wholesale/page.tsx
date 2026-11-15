import type { Metadata } from "next"
import {
  ArrowRight,
  BadgeCheck,
  ChefHat,
  Download,
  Quote,
  Sprout,
  Truck,
  Users,
} from "lucide-react"
import { PageHero } from "@/components/site/page-hero"
import { LeadForm, type FieldDef } from "@/components/site/lead-form"
import { buttonVariants } from "@/components/ui/button"
import { site, whatsappLink } from "@/lib/site"

export const metadata: Metadata = {
  title: "Wholesale & chefs",
  description:
    "Wholesale microgreens for Nairobi restaurants, cafés and grocers. Consistent, chef-grade supply with tiered pricing, standing orders and invoicing.",
}

const benefits = [
  {
    icon: Sprout,
    title: "Harvested to your order",
    body: "We cut after you order, so greens arrive at their peak — not days into a cold chain.",
  },
  {
    icon: Truck,
    title: "Reliable weekly delivery",
    body: "Standing orders on a schedule built around your service, delivered across Nairobi.",
  },
  {
    icon: BadgeCheck,
    title: "Chef-grade consistency",
    body: "Clean, pesticide-free, tray-grown microgreens with consistent size, colour and flavour.",
  },
  {
    icon: Users,
    title: "A real point of contact",
    body: "One person who knows your kitchen, your order and your delivery day.",
  },
]

const steps = [
  { step: "01", title: "Apply", body: "Tell us about your kitchen and weekly needs." },
  { step: "02", title: "Sample", body: "We send a complimentary sample so you can taste the difference." },
  { step: "03", title: "Standing order", body: "Agree your varieties, volumes and delivery day." },
  { step: "04", title: "Invoicing", body: "Trade account with monthly invoicing and M-Pesa or bank transfer." },
]

const testimonials = [
  {
    quote:
      "The consistency is what keeps us coming back — every tray looks and tastes the same, and delivery never slips.",
    name: "Head Chef",
    role: "Restaurant group, Westlands",
  },
  {
    quote:
      "We switched our garnish program to MicroRootsKe and stopped losing greens to the walk-in. Fresher and less waste.",
    name: "Kitchen Manager",
    role: "Hotel, Kilimani",
  },
  {
    quote:
      "Standing order arrives the morning of service, cut that week. It has genuinely made our plating easier.",
    name: "Chef de Partie",
    role: "Café, Karen",
  },
]

const formFields: FieldDef[] = [
  { name: "name", label: "Your name", type: "text", required: true, placeholder: "Jane Mwangi" },
  { name: "email", label: "Email", type: "email", required: true, placeholder: "jane@restaurant.co.ke" },
  { name: "phone", label: "Phone / WhatsApp", type: "tel", placeholder: "+254 7XX XXX XXX" },
  { name: "business", label: "Business name", type: "text", required: true, placeholder: "Restaurant / café / hotel" },
  {
    name: "role",
    label: "Business type",
    type: "select",
    options: ["Restaurant", "Café", "Hotel", "Caterer", "Grocery / Retail", "Other"],
  },
  {
    name: "weeklyVolume",
    label: "Approx. weekly volume",
    type: "select",
    options: ["Under 2 kg", "2–5 kg", "5–10 kg", "10 kg+"],
  },
  {
    name: "message",
    label: "What do you need?",
    type: "textarea",
    full: true,
    placeholder: "Tell us about your menu, service days, and the varieties you're after…",
  },
]

export default function WholesalePage() {
  return (
    <>
      <PageHero eyebrow="Wholesale & chefs" title="Chef-grade microgreens, on your schedule.">
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          We supply Nairobi restaurants, cafés, hotels and grocers with consistent, pesticide-free
          microgreens — harvested to order, delivered weekly, and invoiced like a proper trade
          account.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a href="#apply" className={buttonVariants({ size: "lg" })}>
            Apply for a trade account
          </a>
          <a
            href="/wholesale/price-sheet"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            <Download aria-hidden="true" />
            Download price sheet
          </a>
        </div>
      </PageHero>

      {/* Benefits */}
      <section className="border-b border-border/70">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-primary">Why partner with us</p>
            <h2 className="mt-3 text-2xl font-medium tracking-tight sm:text-3xl">
              Built around a working kitchen
            </h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-xl bg-card p-5 ring-1 ring-foreground/10"
              >
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <benefit.icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-base font-medium">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {benefit.body}
                </p>
              </div>
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
              From first sample to standing order
            </h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.step} className="border-t border-border/70 pt-5">
                <span className="font-mono text-xs text-muted-foreground">{step.step}</span>
                <h3 className="mt-3 text-base font-medium">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-b border-border/70">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-primary">From our kitchens</p>
            <h2 className="mt-3 text-2xl font-medium tracking-tight sm:text-3xl">
              What chefs say
            </h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <figure
                key={testimonial.name}
                className="flex flex-col rounded-xl bg-card p-5 ring-1 ring-foreground/10"
              >
                <Quote className="size-6 text-primary/40" aria-hidden="true" />
                <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-foreground/90">
                  {testimonial.quote}
                </blockquote>
                <figcaption className="mt-4 border-t border-border/70 pt-3 text-xs">
                  <span className="font-medium text-foreground">{testimonial.name}</span>
                  <span className="block text-muted-foreground">{testimonial.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Price sheet + apply */}
      <section id="apply" className="scroll-mt-24">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-sm font-medium text-primary">Wholesale pricing</p>
            <h2 className="mt-3 text-2xl font-medium tracking-tight sm:text-3xl">
              Apply for a trade account
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Tell us a little about your kitchen and weekly needs. We’ll send a tailored quote,
              arrange a sample, and set up your delivery day.
            </p>

            <div
              id="price-sheet"
              className="mt-6 scroll-mt-24 rounded-xl bg-card p-5 ring-1 ring-foreground/10"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Download className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-medium">Wholesale price sheet</p>
                  <p className="text-xs text-muted-foreground">
                    PDF · per-unit pricing across the full range
                  </p>
                </div>
              </div>
              <a
                href="/wholesale/price-sheet"
                className={buttonVariants({ variant: "outline", className: "mt-4 w-full" })}
              >
                Download price sheet
                <ArrowRight aria-hidden="true" />
              </a>
            </div>

            <div className="mt-6 rounded-xl bg-muted/30 p-5 ring-1 ring-foreground/10">
              <p className="flex items-center gap-2 text-sm font-medium">
                <ChefHat className="size-4 text-primary" aria-hidden="true" />
                Rather talk it through?
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Message us on WhatsApp at{" "}
                <a
                  href={whatsappLink(`Hi ${site.name}! I'd like to talk about wholesale pricing.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-foreground underline underline-offset-2"
                >
                  {site.contact.whatsappDisplay}
                </a>{" "}
                and we’ll sort out a sample.
              </p>
            </div>
          </div>

          <LeadForm
            kind="wholesale"
            fields={formFields}
            submitLabel="Apply for a trade account"
            successTitle="Application received"
            successBody="Thanks for telling us about your kitchen. We’ll be in touch within one business day to arrange a sample and confirm wholesale pricing."
          />
        </div>
      </section>
    </>
  )
}