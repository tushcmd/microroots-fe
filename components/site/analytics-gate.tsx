"use client"

import { useSyncExternalStore } from "react"
import { Analytics } from "@vercel/analytics/next"
import { getConsent, subscribeConsent } from "@/lib/consent"

/**
 * Loads Vercel Analytics only after the visitor has accepted optional cookies.
 * Analytics is an optional (consent-gated) cookie, so we don't mount it until
 * the visitor opts in.
 */
export function AnalyticsGate() {
  const consent = useSyncExternalStore(subscribeConsent, getConsent, () => null)

  if (consent !== "accepted") return null
  return <Analytics />
}