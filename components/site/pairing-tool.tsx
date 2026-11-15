"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import {
  ArrowRight,
  Loader2,
  MessageCircle,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProductGlyph, accentPanel } from "@/components/site/product-visual"
import { getProduct } from "@/lib/catalog"
import type { PairingResult } from "@/lib/pairing"
import { site, whatsappLink } from "@/lib/site"
import { cn } from "@/lib/utils"

const EXAMPLES = [
  "Grilled steak with peppercorn sauce",
  "Salmon with lemon butter",
  "Scrambled eggs on toast",
  "Roast chicken and potatoes",
  "Spicy beef tacos",
  "Creamy mushroom pasta",
]

interface ApiResponse {
  result?: PairingResult
  note?: string
  error?: string
}

export function PairingTool() {
  const [meal, setMeal] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PairingResult | null>(null)
  const [note, setNote] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function suggest(value: string) {
    const trimmed = value.trim()
    if (!trimmed || loading) return
    setLoading(true)
    setError(null)
    setNote(null)
    try {
      const res = await fetch("/api/pairing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meal: trimmed }),
      })
      const data = (await res.json().catch(() => ({}))) as ApiResponse
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.")
        return
      }
      if (data.result) {
        setResult(data.result)
        setNote(data.note ?? null)
      } else {
        setError("We couldn't find a match. Try describing the dish a little differently.")
      }
    } catch {
      setError("Unable to reach the server. Check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    void suggest(meal)
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-start">
      {/* Input side */}
      <div>
        <form onSubmit={onSubmit} className="rounded-xl bg-card p-5 ring-1 ring-foreground/10 sm:p-6">
          <label htmlFor="meal" className="text-sm font-medium">
            What are you cooking?
          </label>
          <p className="mt-1 text-sm text-muted-foreground">
            Describe your meal in a few words and we’ll match it with a microgreen that fits.
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <Input
              id="meal"
              value={meal}
              onChange={(event) => setMeal(event.target.value)}
              placeholder="e.g. grilled salmon with herbs"
              maxLength={200}
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={loading || !meal.trim()}
              className={buttonVariants({ className: "sm:w-auto" })}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" aria-hidden="true" />
                  Matching…
                </>
              ) : (
                <>
                  <Sparkles aria-hidden="true" />
                  Find pairing
                </>
              )}
            </button>
          </div>
          <p className="mt-2 text-right text-xs text-muted-foreground">
            {meal.length}/200
          </p>
        </form>

        <div className="mt-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Try an example
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {EXAMPLES.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => {
                  setMeal(example)
                  void suggest(example)
                }}
                disabled={loading}
                className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground disabled:opacity-50"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
          <Sparkles className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden="true" />
          Pairings are suggestions to get you started — trust your taste buds. Message us if you’d
          like a hand choosing.
        </p>
      </div>

      {/* Result side */}
      <div aria-live="polite" className="min-h-64">
        {error && (
          <div className="rounded-xl bg-destructive/10 p-5 text-sm text-destructive">
            {error}
          </div>
        )}

        {!error && !result && (
          <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-border px-6 py-14 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <UtensilsCrossed className="size-6" aria-hidden="true" />
            </span>
            <h3 className="mt-4 text-base font-medium">Your perfect pairing lands here</h3>
            <p className="mt-1 max-w-xs text-sm text-muted-foreground">
              Tell us what’s for dinner and we’ll suggest a microgreen to finish it.
            </p>
          </div>
        )}

        {result && (
          <PairingResultCard result={result} note={note} meal={meal} />
        )}
      </div>
    </div>
  )
}

function PairingResultCard({
  result,
  note,
  meal,
}: {
  result: PairingResult
  note: string | null
  meal: string
}) {
  const product = getProduct(result.productId)

  return (
    <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
      <div className="flex items-center gap-2 border-b border-border/70 bg-primary/5 px-5 py-3">
        <Sparkles className="size-4 text-primary" aria-hidden="true" />
        <p className="text-sm font-medium">
          {result.mode === "ai" ? "AI pairing" : "Curated pairing"}
        </p>
      </div>
      <div className="p-5 sm:p-6">
        {note && (
          <p className="mb-4 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
            {note}
          </p>
        )}
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "flex size-16 shrink-0 items-center justify-center rounded-xl",
              product ? accentPanel[product.accent] : "bg-primary/10",
            )}
          >
            <ProductGlyph
              icon={product?.icon ?? "sprout"}
              accent={product?.accent ?? "emerald"}
              iconClassName="size-8"
            />
          </div>
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              We pair it with
            </p>
            <h3 className="truncate text-lg font-medium tracking-tight">
              {result.productName}
            </h3>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-foreground/90">{result.reason}</p>

        {result.flavour.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {result.flavour.map((flavourNote) => (
              <span
                key={flavourNote}
                className="rounded-md bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
              >
                {flavourNote}
              </span>
            ))}
          </div>
        )}

        {result.runnerUp && (
          <p className="mt-4 border-t border-border/70 pt-3 text-xs text-muted-foreground">
            {result.runnerUp.reason}
          </p>
        )}

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Link
            href={`/shop?q=${encodeURIComponent(result.productName)}`}
            className={cn(buttonVariants(), "flex-1")}
          >
            Shop this green
            <ArrowRight aria-hidden="true" />
          </Link>
          <a
            href={whatsappLink(
              `Hi ${site.name}! You paired "${result.productName}" with my ${result.meal}. Can I order some?`,
            )}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "outline" }), "flex-1")}
          >
            <MessageCircle aria-hidden="true" />
            Order on WhatsApp
          </a>
        </div>
        <p className="mt-3 text-center text-[11px] text-muted-foreground">
          For “{meal}”
        </p>
      </div>
    </div>
  )
}