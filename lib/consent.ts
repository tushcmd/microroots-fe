// Client-side cookie consent storage.
//
// Stores the visitor's choice in localStorage and broadcasts changes so the
// analytics gate can react without a reload. Safe to import from client
// components only (guards against SSR access to window).

export type Consent = "accepted" | "rejected" | null

const STORAGE_KEY = "mr_cookie_consent"
const CHANGE_EVENT = "mr-consent-change"

export function getConsent(): Consent {
  if (typeof window === "undefined") return null
  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    if (value === "accepted" || value === "rejected") return value
    return null
  } catch {
    return null
  }
}

export function setConsent(value: Exclude<Consent, null>): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(STORAGE_KEY, value)
    window.dispatchEvent(new Event(CHANGE_EVENT))
  } catch {
    // Ignore storage failures (e.g. private mode); the choice just won't persist.
  }
}

export function subscribeConsent(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {}
  window.addEventListener(CHANGE_EVENT, callback)
  window.addEventListener("storage", callback)
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback)
    window.removeEventListener("storage", callback)
  }
}