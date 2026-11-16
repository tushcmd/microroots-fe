"use client"

import { useMemo, useState, type FormEvent } from "react"
import Link from "next/link"
import { Check, CheckCircle2, Leaf, Loader2, Sparkles } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getCatalog } from "@/lib/catalog"
import { cn } from "@/lib/utils"

interface Plan {
  id: string
  name: string
  max: number
  price: number
  blurb: string
}

const PLANS: Plan[] = [
  { id: "petite", name: "Petite", max: 2, price: 550, blurb: "A little of the week’s best" },
  { id: "classic", name: "Classic", max: 3, price: 750, blurb: "Our most popular box" },
  { id: "family", name: "Family", max: 4, price: 1000, blurb: "For households that cook a lot" },
]

const FREQUENCIES = [
  { id: "weekly", label: "Weekly", discount: 0 },
  { id: "fortnightly", label: "Every 2 weeks", discount: 0.05 },
  { id: "monthly", label: "Monthly", discount: 0.1 },
]

type Status = "idle" | "loading" | "success" | "error"

export function BoxBuilder() {
  const products = useMemo(() => getCatalog(), [])
  const [planId, setPlanId] = useState("classic")
  const [frequencyId, setFrequencyId] = useState("weekly")
  const [selected, setSelected] = useState<string[]>([])
  const [contact, setContact] = useState({ name: "", email: "", phone: "", area: "" })
  const [status, setStatus] = useState<Status>("idle")
  const [error, setError] = useState<string | null>(null)

  const plan = PLANS.find((p) => p.id === planId) ?? PLANS[1]
  const frequency = FREQUENCIES.find((f) => f.id === frequencyId) ?? FREQUENCIES[0]
  const price = Math.round(plan.price * (1 - frequency.discount))
  const atMax = selected.length >= plan.max

  const selectedProducts = products.filter((p) => selected.includes(p.id))

  function changePlan(next: Plan) {
    setPlanId(next.id)
    setSelected((prev) => prev.slice(0, next.max))
  }

  function toggle(id: string) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((value) => value !== id)
      if (prev.length >= plan.max) return prev
      return [...prev, id]
    })
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (status === "loading") return
    if (selected.length === 0) {
      setError("Pick at least one variety for your box.")
      setStatus("error")
      return
    }
    setStatus("loading")
    setError(null)
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "harvest-club",
          ...contact,
          plan: plan.name,
          frequency: frequency.label,
          message: `Box: ${selectedProducts
            .map((p) => p.name)
            .join(", ")} · Est. KES ${price} per delivery`,
        }),
      })
      const data = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.")
        setStatus("error")
        return
      }
      setStatus("success")
    } catch {
      setError("Unable to reach the server. Check your connection and try again.")
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <div
        className="rounded-xl bg-card p-6 text-center ring-1 ring-foreground/10 sm:p-8"
        role="status"
      >
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="size-6" aria-hidden="true" />
        </span>
        <h3 className="mt-4 text-lg font-medium tracking-tight">You’re on the list</h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          Thanks, {contact.name.split(" ")[0] || "there"}! We’ve noted your interest in the{" "}
          {plan.name} box, {frequency.label.toLowerCase()}, with{" "}
          {selectedProducts.map((p) => p.name).join(", ")}. We’ll be in touch to confirm your plan
          and first delivery date — no payment is taken yet.
        </p>
        <button
          type="button"
          className={cn(buttonVariants({ variant: "outline" }), "mt-5")}
          onClick={() => {
            setStatus("idle")
            setSelected([])
            setContact({ name: "", email: "", phone: "", area: "" })
          }}
        >
          Build another box
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl bg-card p-5 ring-1 ring-foreground/10 sm:p-6"
    >
      {/* Plans */}
      <fieldset>
        <legend className="text-sm font-medium">1. Choose your box size</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {PLANS.map((option) => {
            const active = option.id === planId
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => changePlan(option)}
                aria-pressed={active}
                className={cn(
                  "flex flex-col rounded-lg border p-4 text-left transition-colors",
                  active
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border bg-background hover:border-primary/40",
                )}
              >
                <span className="flex items-center justify-between">
                  <span className="text-sm font-medium">{option.name}</span>
                  {active && <Check className="size-4 text-primary" aria-hidden="true" />}
                </span>
                <span className="mt-1 text-xs text-muted-foreground">{option.blurb}</span>
                <span className="mt-2 text-sm font-medium">
                  {option.max} varieties · from KES {option.price}
                </span>
              </button>
            )
          })}
        </div>
      </fieldset>

      {/* Frequency */}
      <fieldset className="mt-6">
        <legend className="text-sm font-medium">2. How often?</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {FREQUENCIES.map((option) => {
            const active = option.id === frequencyId
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setFrequencyId(option.id)}
                aria-pressed={active}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm transition-colors",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
                )}
              >
                {option.label}
                {option.discount > 0 && (
                  <span className={cn("ml-1 text-xs", active ? "opacity-80" : "text-primary")}>
                    −{Math.round(option.discount * 100)}%
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </fieldset>

      {/* Varieties */}
      <fieldset className="mt-6">
        <legend className="text-sm font-medium">
          3. What’s in your box?{" "}
          <span className="font-normal text-muted-foreground">
            ({selected.length}/{plan.max})
          </span>
        </legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {products.map((product) => {
            const active = selected.includes(product.id)
            const disabled = !active && atMax
            return (
              <button
                key={product.id}
                type="button"
                onClick={() => toggle(product.id)}
                disabled={disabled}
                aria-pressed={active}
                className={cn(
                  "flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                  active
                    ? "border-primary bg-primary/5"
                    : "border-border bg-background hover:border-primary/40",
                  disabled && "cursor-not-allowed opacity-50",
                )}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span
                    className={cn(
                      "flex size-4 shrink-0 items-center justify-center rounded border",
                      active ? "border-primary bg-primary text-primary-foreground" : "border-border",
                    )}
                  >
                    {active && <Check className="size-3" aria-hidden="true" />}
                  </span>
                  <span className="truncate">{product.name}</span>
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  KES {product.priceKes}
                </span>
              </button>
            )
          })}
        </div>
        {atMax && (
          <p className="mt-2 text-xs text-muted-foreground">
            You’ve picked the maximum for this box. Deselect one to swap, or choose a bigger box.
          </p>
        )}
      </fieldset>

      {/* Summary */}
      <div className="mt-6 flex flex-col gap-3 rounded-lg bg-primary/5 p-4 ring-1 ring-primary/15 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-medium">
            <Leaf className="size-4 text-primary" aria-hidden="true" />
            {plan.name} · {frequency.label}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {selectedProducts.length > 0
              ? selectedProducts.map((p) => p.name).join(", ")
              : "No varieties picked yet"}
          </p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-lg font-medium">KES {price.toLocaleString()}</p>
          <p className="text-[11px] text-muted-foreground">per delivery</p>
        </div>
      </div>

      {/* Contact */}
      <div className="mt-6">
        <p className="text-sm font-medium">4. Where should we send it?</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="box-name">
              Name<span className="text-destructive"> *</span>
            </Label>
            <Input
              id="box-name"
              value={contact.name}
              onChange={(e) => setContact({ ...contact, name: e.target.value })}
              required
              placeholder="Jane Mwangi"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="box-email">
              Email<span className="text-destructive"> *</span>
            </Label>
            <Input
              id="box-email"
              type="email"
              value={contact.email}
              onChange={(e) => setContact({ ...contact, email: e.target.value })}
              required
              placeholder="jane@email.com"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="box-phone">Phone / WhatsApp</Label>
            <Input
              id="box-phone"
              type="tel"
              value={contact.phone}
              onChange={(e) => setContact({ ...contact, phone: e.target.value })}
              placeholder="+254 7XX XXX XXX"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="box-area">Delivery area</Label>
            <Input
              id="box-area"
              value={contact.area}
              onChange={(e) => setContact({ ...contact, area: e.target.value })}
              placeholder="e.g. Kilimani"
            />
          </div>
        </div>
      </div>

      {error && (
        <p className="mt-4 text-sm font-medium text-destructive" role="alert">
          {error}
        </p>
      )}

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
          <Sparkles className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden="true" />
          This registers your interest — we’ll confirm your plan and first delivery before any
          payment. By registering you agree to our{" "}
          <Link href="/privacy" className="font-medium text-foreground underline underline-offset-2">
            Privacy Policy
          </Link>
          .
        </p>
        <button
          type="submit"
          disabled={status === "loading"}
          className={buttonVariants({ size: "lg", className: "sm:w-auto" })}
        >
          {status === "loading" ? (
            <>
              <Loader2 className="animate-spin" aria-hidden="true" />
              Registering…
            </>
          ) : (
            "Register interest"
          )}
        </button>
      </div>
    </form>
  )
}