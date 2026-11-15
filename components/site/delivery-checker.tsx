"use client"

import { useState, type FormEvent } from "react"
import { AlertCircle, Check, MapPin, MessageCircle, Search } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  checkDeliveryZone,
  getDeliveryZones,
  type DeliveryZone,
} from "@/lib/delivery"
import { site, whatsappLink } from "@/lib/site"
import { cn } from "@/lib/utils"

type Result = DeliveryZone | null | undefined

export function DeliveryChecker() {
  const [query, setQuery] = useState("")
  const [result, setResult] = useState<Result>(undefined)
  const zones = getDeliveryZones()

  function runCheck(value: string) {
    setQuery(value)
    setResult(checkDeliveryZone(value))
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    setResult(checkDeliveryZone(query))
  }

  return (
    <div className="rounded-xl bg-card p-5 ring-1 ring-foreground/10 sm:p-6">
      <h3 className="text-base font-medium">Do we deliver to you?</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Enter your neighbourhood or Nairobi postal code to check your delivery day.
      </p>

      <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <MapPin
            className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="e.g. Kilimani or 00100"
            aria-label="Neighbourhood or postal code"
            className="pl-8"
          />
        </div>
        <button type="submit" className={buttonVariants()}>
          <Search aria-hidden="true" />
          Check
        </button>
      </form>

      <div aria-live="polite" className="mt-4">
        {result === undefined && (
          <p className="text-sm text-muted-foreground">
            We currently deliver to {zones.length} areas across Nairobi.
          </p>
        )}

        {result === null && (
          <div className="flex items-start gap-3 rounded-lg bg-destructive/10 p-4 text-sm">
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden="true" />
            <div>
              <p className="font-medium text-foreground">
                We don’t reach “{query.trim()}” just yet.
              </p>
              <p className="mt-1 text-muted-foreground">
                We’re adding new routes each month. Message us and we’ll tell you when we’re in
                your area — or arrange farm-gate or market pickup.
              </p>
              <a
                href={whatsappLink(
                  `Hi MicroRootsKe! Do you deliver to ${query.trim()}? Please let me know when you'll be in my area.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ size: "sm", variant: "outline" }), "mt-3")}
              >
                <MessageCircle aria-hidden="true" />
                Ask about my area
              </a>
            </div>
          </div>
        )}

        {result && (
          <div className="flex items-start gap-3 rounded-lg bg-primary/5 p-4 ring-1 ring-primary/15">
            <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <p className="font-medium">Good news — we deliver to {result.area}.</p>
              <dl className="mt-2 grid gap-1 text-sm text-muted-foreground sm:grid-cols-3">
                <div>
                  <dt className="text-[11px] uppercase tracking-wide">Day</dt>
                  <dd className="text-foreground">{result.day}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-wide">Window</dt>
                  <dd className="text-foreground">{result.slot}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-wide">Fee</dt>
                  <dd className="text-foreground">
                    KES {result.feeKes}
                    {result.freeOverKes
                      ? ` · free over ${result.freeOverKes.toLocaleString()}`
                      : ""}
                  </dd>
                </div>
              </dl>
              <a
                href={whatsappLink(
                  `Hi MicroRootsKe! I'm in ${result.area} and would like to order for ${result.day} delivery.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ size: "sm" }), "mt-3")}
              >
                <MessageCircle aria-hidden="true" />
                Order for {result.day}
              </a>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          Popular areas
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {zones.map((zone) => (
            <button
              key={zone.area}
              type="button"
              onClick={() => runCheck(zone.area)}
              className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              {zone.area}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Prefer to ask? Message us on WhatsApp at{" "}
        <a
          href={whatsappLink("Hi MicroRootsKe! I'd like to check delivery to my area.")}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-foreground underline underline-offset-2"
        >
          {site.contact.whatsappDisplay}
        </a>
      </p>
    </div>
  )
}