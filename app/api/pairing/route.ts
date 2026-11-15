import { NextResponse } from "next/server"
import { rateLimit, clientKey, sweepExpired } from "@/lib/server/rate-limit"
import { hasBudget, charge } from "@/lib/server/cost-cap"
import {
  buildPairingPrompt,
  coercePairingResult,
  suggestPairing,
} from "@/lib/pairing"

// Node.js runtime: we read process.env and call an external API.
export const runtime = "nodejs"

const RATE_LIMIT = 8
const RATE_WINDOW_MS = 60_000
const MAX_MEAL_LENGTH = 200
const ESTIMATED_TOKENS = 300

function originAllowed(request: Request): boolean {
  const origin = request.headers.get("origin")
  if (!origin) return true
  try {
    return new URL(origin).host === new URL(request.url).host
  } catch {
    return false
  }
}

/** Parse JSON that may be wrapped in markdown fences or extra prose. */
function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text)
  } catch {}
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)
  if (fenced?.[1]) {
    try {
      return JSON.parse(fenced[1])
    } catch {}
  }
  const first = text.indexOf("{")
  const last = text.lastIndexOf("}")
  if (first !== -1 && last > first) {
    try {
      return JSON.parse(text.slice(first, last + 1))
    } catch {}
  }
  return null
}

export async function POST(request: Request) {
  if (!originAllowed(request)) {
    return NextResponse.json({ error: "Forbidden origin" }, { status: 403 })
  }

  // Rate limit per client so the LLM (and our budget) can't be hammered.
  sweepExpired()
  const limit = rateLimit(clientKey(request.headers, "pairing"), RATE_LIMIT, RATE_WINDOW_MS)
  if (!limit.ok) {
    return NextResponse.json(
      { error: "You're sending requests too quickly. Please wait a moment and try again." },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(limit.retryAfterMs / 1000)) },
      },
    )
  }

  let meal = ""
  try {
    const body = (await request.json()) as { meal?: unknown }
    if (typeof body?.meal === "string") meal = body.meal.trim()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  if (!meal) {
    return NextResponse.json({ error: "Tell us what you're cooking first." }, { status: 400 })
  }
  if (meal.length > MAX_MEAL_LENGTH) {
    return NextResponse.json(
      { error: `Keep it under ${MAX_MEAL_LENGTH} characters so we can match it well.` },
      { status: 400 },
    )
  }

  const apiKey = process.env.OPENAI_API_KEY

  // No LLM configured: use the curated ruleset. This keeps the tool fully
  // functional with zero configuration.
  if (!apiKey) {
    return NextResponse.json({ result: suggestPairing(meal) })
  }

  // Global daily cost cap — fall back to curated results when exhausted.
  if (!hasBudget()) {
    return NextResponse.json({
      result: suggestPairing(meal),
      note: "AI pairing is taking a breather for today. Here’s a curated pick instead.",
    })
  }

  try {
    const { system, user } = buildPairingPrompt(meal)
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        temperature: 0.4,
        max_tokens: 200,
        response_format: { type: "json_object" },
      }),
    })

    if (!res.ok) {
      charge(ESTIMATED_TOKENS)
      console.error("[pairing] LLM responded", res.status)
      return NextResponse.json({
        result: suggestPairing(meal),
        note: "Couldn't reach the AI just now — here's a curated pick instead.",
      })
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[]
      usage?: { total_tokens?: number }
    }
    charge(data.usage?.total_tokens ?? ESTIMATED_TOKENS)

    const content = data.choices?.[0]?.message?.content
    const parsed = typeof content === "string" ? safeJsonParse(content) : null
    const coerced = coercePairingResult(parsed, meal)

    if (coerced) return NextResponse.json({ result: coerced })

    return NextResponse.json({ result: suggestPairing(meal) })
  } catch (err) {
    charge(ESTIMATED_TOKENS)
    const message = err instanceof Error ? err.message : "unknown error"
    console.error("[pairing] LLM call failed:", message)
    return NextResponse.json({
      result: suggestPairing(meal),
      note: "Couldn't reach the AI just now — here's a curated pick instead.",
    })
  }
}