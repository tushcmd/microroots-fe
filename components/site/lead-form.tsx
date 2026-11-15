"use client"

import { useState, type FormEvent } from "react"
import { CheckCircle2, Loader2 } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export type FieldType = "text" | "email" | "tel" | "textarea" | "select"

export interface FieldDef {
  /** Submitted field name. */
  name: string
  label: string
  type: FieldType
  placeholder?: string
  required?: boolean
  options?: string[]
  /** Default value for the field. */
  defaultValue?: string
  /** Span both columns on wider screens. */
  full?: boolean
}

interface LeadFormProps {
  kind: "wholesale" | "harvest-club" | "contact"
  fields: FieldDef[]
  submitLabel: string
  successTitle: string
  successBody: string
  className?: string
}

type Status = "idle" | "loading" | "success" | "error"

function initialValues(fields: FieldDef[]): Record<string, string> {
  const values: Record<string, string> = {}
  for (const field of fields) values[field.name] = field.defaultValue ?? ""
  return values
}

export function LeadForm({
  kind,
  fields,
  submitLabel,
  successTitle,
  successBody,
  className,
}: LeadFormProps) {
  const [values, setValues] = useState<Record<string, string>>(() => initialValues(fields))
  const [company, setCompany] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [error, setError] = useState<string | null>(null)

  function update(name: string, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (status === "loading") return
    setStatus("loading")
    setError(null)
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, company, ...values }),
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
        className={cn(
          "rounded-xl bg-card p-6 text-center ring-1 ring-foreground/10 sm:p-8",
          className,
        )}
        role="status"
      >
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="size-6" aria-hidden="true" />
        </span>
        <h3 className="mt-4 text-lg font-medium tracking-tight">{successTitle}</h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          {successBody}
        </p>
        <Button
          type="button"
          variant="outline"
          className={cn(buttonVariants(), "mt-5")}
          onClick={() => {
            setValues(initialValues(fields))
            setStatus("idle")
          }}
        >
          Send another message
        </Button>
      </div>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn("rounded-xl bg-card p-5 ring-1 ring-foreground/10 sm:p-6", className)}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => {
          const id = `lead-${field.name}`
          const commonProps = {
            id,
            name: field.name,
            required: field.required,
            "aria-invalid": status === "error" ? true : undefined,
          }
          return (
            <div
              key={field.name}
              className={cn("flex flex-col gap-1.5", field.full && "sm:col-span-2")}
            >
              <Label htmlFor={id}>
                {field.label}
                {field.required && <span className="text-destructive"> *</span>}
              </Label>

              {field.type === "textarea" ? (
                <textarea
                  {...commonProps}
                  value={values[field.name] ?? ""}
                  onChange={(event) => update(field.name, event.target.value)}
                  placeholder={field.placeholder}
                  rows={4}
                  className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
              ) : field.type === "select" ? (
                <select
                  {...commonProps}
                  value={values[field.name] ?? ""}
                  onChange={(event) => update(field.name, event.target.value)}
                  className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {field.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  {...commonProps}
                  type={field.type}
                  value={values[field.name] ?? ""}
                  onChange={(event) => update(field.name, event.target.value)}
                  placeholder={field.placeholder}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Honeypot — hidden from people, tempting to bots. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="lead-company">Company</label>
        <input
          id="lead-company"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(event) => setCompany(event.target.value)}
        />
      </div>

      {error && (
        <p className="mt-4 text-sm font-medium text-destructive" role="alert">
          {error}
        </p>
      )}

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          We’ll only use your details to reply to this enquiry.
        </p>
        <Button type="submit" disabled={status === "loading"} className="sm:w-auto">
          {status === "loading" ? (
            <>
              <Loader2 className="animate-spin" aria-hidden="true" />
              Sending…
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  )
}