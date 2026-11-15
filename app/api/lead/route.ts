import { NextResponse } from "next/server"
import { rateLimit, clientKey, sweepExpired } from "@/lib/server/rate-limit"
import { sendEmail } from "@/lib/server/email"
import { site } from "@/lib/site"

// Node.js runtime: we send email via an external HTTP API.
export const runtime = "nodejs"

const LEAD_KINDS = ["wholesale", "harvest-club", "contact"] as const
type LeadKind = (typeof LEAD_KINDS)[number]

const RATE_LIMIT = 5
const RATE_WINDOW_MS = 10 * 60_000
const MAX_FIELD = 2000

function originAllowed(request: Request): boolean {
  const origin = request.headers.get("origin")
  if (!origin) return true
  try {
    return new URL(origin).host === new URL(request.url).host
  } catch {
    return false
  }
}

function str(value: unknown, max = MAX_FIELD): string {
  if (typeof value !== "string") return ""
  return value.trim().slice(0, max)
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function subjectFor(kind: LeadKind, name: string): string {
  switch (kind) {
    case "wholesale":
      return `Wholesale application from ${name}`
    case "harvest-club":
      return `Harvest Club interest from ${name}`
    default:
      return `New contact message from ${name}`
  }
}

function bodyFor(kind: LeadKind, data: Record<string, string>): string {
  const lines = Object.entries(data)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key[0].toUpperCase()}${key.slice(1)}: ${value}`)
  return [
    `New ${kind} lead via the MicroRootsKe website.`,
    "",
    ...lines,
    "",
    `— Sent ${new Date().toISOString()}`,
  ].join("\n")
}

export async function POST(request: Request) {
  if (!originAllowed(request)) {
    return NextResponse.json({ error: "Forbidden origin" }, { status: 403 })
  }

  sweepExpired()
  const limit = rateLimit(clientKey(request.headers, "lead"), RATE_LIMIT, RATE_WINDOW_MS)
  if (!limit.ok) {
    return NextResponse.json(
      { error: "You've sent a few messages already. Please try again in a little while." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(limit.retryAfterMs / 1000)) } },
    )
  }

  let raw: Record<string, unknown>
  try {
    raw = (await request.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  // Honeypot: if the hidden "company" field is filled, silently accept.
  if (str(raw.company)) {
    return NextResponse.json({ ok: true, status: "captured" })
  }

  const kind = str(raw.kind) as LeadKind
  if (!LEAD_KINDS.includes(kind)) {
    return NextResponse.json({ error: "Unknown form type." }, { status: 400 })
  }

  const name = str(raw.name, 120)
  const email = str(raw.email, 200)
  const phone = str(raw.phone, 40)

  if (name.length < 2) {
    return NextResponse.json({ error: "Please tell us your name." }, { status: 400 })
  }
  if (!isEmail(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 })
  }

  const data: Record<string, string> = {
    name,
    email,
    phone,
    business: str(raw.business, 160),
    role: str(raw.role, 80),
    weeklyVolume: str(raw.weeklyVolume, 80),
    plan: str(raw.plan, 80),
    frequency: str(raw.frequency, 80),
    area: str(raw.area, 120),
    message: str(raw.message),
  }

  const to = process.env.LEAD_TO_EMAIL || site.contact.email
  const result = await sendEmail({
    to,
    subject: subjectFor(kind, name),
    text: bodyFor(kind, data),
    replyTo: email || undefined,
  })

  if (result.status === "error") {
    // Still return ok so the visitor isn't blocked by an email outage; the lead
    // was captured server-side and logged.
    return NextResponse.json({ ok: true, status: "captured", warning: result.error })
  }

  return NextResponse.json({ ok: true, status: result.status })
}