import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowUpRight,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Store,
  Truck,
} from "lucide-react"
import { PageHero } from "@/components/site/page-hero"
import { DeliveryChecker } from "@/components/site/delivery-checker"
import { buttonVariants } from "@/components/ui/button"
import { getDeliveryZones, getPickupSpots } from "@/lib/delivery"
import { site, telLink, whatsappLink } from "@/lib/site"

export const metadata: Metadata = {
  title: "Contact & delivery",
  description:
    "Reach MicroRootsKe on WhatsApp, phone or email, check your Nairobi delivery day and find pickup spots.",
}

export default function ContactPage() {
  const zones = getDeliveryZones()
  const pickup = getPickupSpots()

  return (
    <>
      <PageHero eyebrow="Contact & delivery" title="Get in touch, and check your delivery day.">
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Message us for the fastest reply, check whether we deliver to your neighbourhood, or find
          a pickup spot near you. We deliver across Nairobi on set days each week.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            href={whatsappLink("Hi MicroRootsKe! I'd like to get in touch.")}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ size: "lg" })}
          >
            <MessageCircle aria-hidden="true" />
            Chat on WhatsApp
          </a>
          <a href={telLink()} className={buttonVariants({ variant: "outline", size: "lg" })}>
            <Phone aria-hidden="true" />
            {site.contact.phoneDisplay}
          </a>
        </div>
      </PageHero>

      {/* Contact methods */}
      <section className="border-b border-border/70">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {[
            {
              icon: MessageCircle,
              label: "WhatsApp",
              value: site.contact.whatsappDisplay,
              href: whatsappLink("Hi MicroRootsKe!"),
              hint: "Fastest way to reach us",
            },
            {
              icon: Phone,
              label: "Call",
              value: site.contact.phoneDisplay,
              href: telLink(),
              hint: site.contact.hours,
            },
            {
              icon: Mail,
              label: "Email",
              value: site.contact.email,
              href: `mailto:${site.contact.email}`,
              hint: "For quotes and partnerships",
            },
            {
              icon: MapPin,
              label: "Visit / pickup",
              value: site.contact.location,
              href: "https://www.openstreetmap.org/?mlat=-1.2864&mlon=36.8172#map=12/-1.2864/36.8172",
              hint: "By appointment — message first",
            },
          ].map((method) => (
            <a
              key={method.label}
              href={method.href}
              target={method.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="group flex flex-col rounded-xl bg-card p-5 ring-1 ring-foreground/10 transition-colors hover:ring-primary/30"
            >
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <method.icon className="size-4.5" aria-hidden="true" />
              </span>
              <p className="mt-3 text-xs uppercase tracking-wide text-muted-foreground">
                {method.label}
              </p>
              <p className="mt-1 flex items-center gap-1 text-sm font-medium break-words">
                {method.value}
                <ArrowUpRight
                  className="size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{method.hint}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Delivery checker + zones */}
      <section className="border-b border-border/70 bg-muted/20">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-sm font-medium text-primary">Delivery zones</p>
            <h2 className="mt-3 text-2xl font-medium tracking-tight sm:text-3xl">
              Where and when we deliver
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              We run set delivery days by area so greens arrive fresh, not after days on a van.
              Check your neighbourhood below, or browse the full schedule.
            </p>
            <div className="mt-6">
              <DeliveryChecker />
            </div>
          </div>

          <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
            <div className="flex items-center gap-2 border-b border-border/70 px-5 py-4">
              <Truck className="size-4 text-primary" aria-hidden="true" />
              <h3 className="text-sm font-medium">Weekly delivery schedule</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border/70 text-[11px] uppercase tracking-wide text-muted-foreground">
                    <th className="px-5 py-2.5 font-medium">Area</th>
                    <th className="px-3 py-2.5 font-medium">Day</th>
                    <th className="px-3 py-2.5 font-medium">Window</th>
                    <th className="px-5 py-2.5 text-right font-medium">Fee</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/70">
                  {zones.map((zone) => (
                    <tr key={zone.area} className="transition-colors hover:bg-muted/30">
                      <td className="px-5 py-3 font-medium">{zone.area}</td>
                      <td className="px-3 py-3 text-muted-foreground">{zone.day}</td>
                      <td className="px-3 py-3 text-muted-foreground">{zone.slot}</td>
                      <td className="px-5 py-3 text-right whitespace-nowrap">
                        KES {zone.feeKes}
                        {zone.freeOverKes && (
                          <span className="block text-[11px] text-muted-foreground">
                            free over {zone.freeOverKes.toLocaleString()}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="border-t border-border/70 px-5 py-3 text-xs text-muted-foreground">
              Delivery is free over KES 2,500 (KES 3,500 in outlying areas). Not seeing your area?{" "}
              <a
                href={whatsappLink("Hi MicroRootsKe! Do you deliver to my area?")}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline underline-offset-2"
              >
                Ask us
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Pickup + map */}
      <section className="border-b border-border/70">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="text-sm font-medium text-primary">Pickup</p>
            <h2 className="mt-3 text-2xl font-medium tracking-tight sm:text-3xl">
              Collect your order
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Prefer to skip delivery? Collect from the farm or catch us at the Saturday market.
            </p>
            <ul className="mt-6 space-y-3">
              {pickup.map((spot) => (
                <li
                  key={spot.name}
                  className="flex items-start gap-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Store className="size-4.5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-medium">{spot.name}</p>
                    <p className="text-xs text-muted-foreground">{spot.area}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {spot.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="size-4 shrink-0 text-primary" aria-hidden="true" />
              Farm hours: {site.contact.hours}
            </p>
          </div>

          <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
            <iframe
              title="Map of MicroRootsKe delivery area in Nairobi"
              src="https://www.openstreetmap.org/export/embed.html?bbox=36.6500%2C-1.4000%2C37.0000%2C-1.1500&layer=mapnik&marker=-1.2864%2C36.8172"
              className="h-80 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="flex items-center justify-between gap-3 border-t border-border/70 px-5 py-3">
              <p className="text-xs text-muted-foreground">
                Serving Nairobi and surrounds · Map centred on the city
              </p>
              <a
                href="https://www.openstreetmap.org/?mlat=-1.2864&mlon=36.8172#map=12/-1.2864/36.8172"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                Open map
                <ArrowUpRight className="size-3" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 py-14 sm:px-6 sm:py-16 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-medium tracking-tight sm:text-2xl">
              Ready to order for your area?
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Shop online and order via WhatsApp, or read our{" "}
              <Link href="/faq" className="font-medium text-foreground underline underline-offset-2">
                FAQ &amp; care guide
              </Link>
              .
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/shop" className={buttonVariants({ size: "lg" })}>
              Shop Fresh Harvest
            </Link>
            <a
              href={whatsappLink("Hi MicroRootsKe! I'd like to place an order.")}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              <MessageCircle aria-hidden="true" />
              Order on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  )
}