"use client"

import Link from "next/link"
import { useSyncExternalStore } from "react"
import { Cookie } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { getConsent, setConsent, subscribeConsent } from "@/lib/consent"
import { cn } from "@/lib/utils"

// Detect mount without setState-in-effect (see theme-toggle.tsx).
function subscribeMounted() {
  return () => {}
}

export function CookieBanner() {
  const mounted = useSyncExternalStore(
    subscribeMounted,
    () => true,
    () => false,
  )
  const consent = useSyncExternalStore(subscribeConsent, getConsent, () => null)

  // Render nothing on the server, and only while the choice is undecided.
  if (!mounted || consent !== null) return null

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-3 bottom-3 z-50 sm:inset-x-auto sm:right-4 sm:bottom-4 sm:max-w-sm"
    >
      <div className="rounded-xl border border-border bg-card/95 p-4 shadow-lg backdrop-blur">
        <div className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Cookie className="size-4.5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium">We use cookies</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Essential cookies keep the site working. With your consent we also use analytics to
              understand how it’s used. Read our{" "}
              <Link
                href="/cookies"
                className="font-medium text-foreground underline underline-offset-2"
              >
                Cookie Policy
              </Link>
              .
            </p>
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => setConsent("accepted")}
            className={cn(buttonVariants({ size: "sm" }), "flex-1")}
          >
            Accept
          </button>
          <button
            type="button"
            onClick={() => setConsent("rejected")}
            className={cn(buttonVariants({ size: "sm", variant: "outline" }), "flex-1")}
          >
            Reject optional
          </button>
        </div>
      </div>
    </div>
  )
}