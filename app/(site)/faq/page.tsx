import type { Metadata } from "next"
import Link from "next/link"
import { ChevronDown, MessageCircle, Phone } from "lucide-react"
import { PageHero } from "@/components/site/page-hero"
import { buttonVariants } from "@/components/ui/button"
import { site, telLink, whatsappLink } from "@/lib/site"

export const metadata: Metadata = {
  title: "FAQ & care guide",
  description:
    "Answers about ordering, delivery, storing cut microgreens and caring for living trays from MicroRootsKe.",
}

interface FaqItem {
  q: string
  a: string
}

interface FaqSection {
  title: string
  items: FaqItem[]
}

const sections: FaqSection[] = [
  {
    title: "Ordering & delivery",
    items: [
      {
        q: "How do I place an order?",
        a: "Browse the shop and tap Order on any product to open WhatsApp with your order pre-filled, or message us directly. We confirm availability and your delivery day before anything is charged.",
      },
      {
        q: "Do you deliver to my area?",
        a: "We deliver across Nairobi on set days each week, plus farm-gate and market pickup. Use the checker on the Contact & Delivery page to see if we reach your neighbourhood and which day we deliver.",
      },
      {
        q: "Which days do you deliver?",
        a: "Delivery days depend on your area — typically Tuesday to Saturday. Each zone has its own day and time window, shown on the Contact & Delivery page.",
      },
      {
        q: "Is there a minimum order?",
        a: "There is no minimum for delivery, but delivery is free over KES 2,500 (KES 3,500 in outlying areas). Below that, a delivery fee of KES 200–350 applies depending on your zone.",
      },
      {
        q: "How can I pay?",
        a: "Payment is arranged with you when we confirm your order — M-Pesa or cash on delivery. Card and in-app checkout are coming soon.",
      },
    ],
  },
  {
    title: "Storing cut microgreens",
    items: [
      {
        q: "How long do cut microgreens last?",
        a: "Kept dry and refrigerated, cut microgreens stay fresh for about 5–7 days. Because they are cut to order, they arrive much fresher than supermarket greens.",
      },
      {
        q: "What's the best way to store them?",
        a: "Keep them in their punnet or a container lined with a dry paper towel, covered loosely, in the coldest part of the fridge. Avoid sealing them airtight while damp.",
      },
      {
        q: "Should I wash them first?",
        a: "We grow in clean, controlled conditions, so a quick rinse is optional. If you do rinse, dry gently and use them straight away for the best texture.",
      },
    ],
  },
  {
    title: "Living trays",
    items: [
      {
        q: "How do I care for a living tray?",
        a: "Place it somewhere bright but out of harsh direct sun, and water lightly when the tray feels light. Harvest by snipping what you need with clean scissors, leaving the base to regrow.",
      },
      {
        q: "How many times will it regrow?",
        a: "Most trays give a second and sometimes a third cut over a couple of weeks, depending on light and watering. Pea shoots and sunflower are especially generous.",
      },
      {
        q: "The tray looks dry — what should I do?",
        a: "Give it a gentle, even watering and let it recover overnight. If it has gone leggy or yellow, it has likely finished — add it to compost and start a fresh tray.",
      },
    ],
  },
  {
    title: "Wholesale & chefs",
    items: [
      {
        q: "Do you supply restaurants and cafés?",
        a: "Yes. We run a wholesale programme for Nairobi kitchens with tiered pricing, standing orders timed around service, and invoicing. See the Wholesale & Chefs page or apply there.",
      },
      {
        q: "Is there a wholesale minimum?",
        a: "Wholesale orders are quoted per kitchen based on volume and frequency. Tell us your weekly needs in the application form and we'll send pricing and a sample.",
      },
      {
        q: "Can I get a price sheet?",
        a: "Yes — there is a downloadable wholesale price sheet on the Wholesale & Chefs page, and we're happy to tailor a quote to your menu.",
      },
    ],
  },
]

export default function FaqPage() {
  return (
    <>
      <PageHero eyebrow="FAQ & care guide" title="Answers, and how to keep greens at their best.">
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Everything about ordering, delivery, storing cut microgreens and caring for living trays.
          Can’t find what you need? Message us and a real person will answer.
        </p>
      </PageHero>

      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="space-y-10">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-lg font-medium tracking-tight">{section.title}</h2>
              <div className="mt-4 divide-y divide-border/70 overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
                {section.items.map((item) => (
                  <details key={item.q} className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-medium outline-none transition-colors hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring/50">
                      <span>{item.q}</span>
                      <ChevronDown
                        className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                        aria-hidden="true"
                      />
                    </summary>
                    <p className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-xl bg-muted/30 p-6 ring-1 ring-foreground/10 sm:p-8">
          <h2 className="text-lg font-medium tracking-tight">Still have a question?</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Message us on WhatsApp for the fastest answer, or reach the farm directly. We’re around{" "}
            {site.contact.hours}.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <a
              href={whatsappLink("Hi MicroRootsKe! I have a question about my order.")}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants()}
            >
              <MessageCircle aria-hidden="true" />
              Chat on WhatsApp
            </a>
            <a href={telLink()} className={buttonVariants({ variant: "outline" })}>
              <Phone aria-hidden="true" />
              {site.contact.phoneDisplay}
            </a>
            <Link
              href="/contact"
              className={buttonVariants({ variant: "ghost" })}
            >
              Contact &amp; delivery info
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}