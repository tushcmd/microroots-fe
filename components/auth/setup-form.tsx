"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ApiError, createAdminAccount } from "@/lib/api"
import { Brand } from "@/components/layout/brand"

// Admin numbers follow the format AD-YYYY-#### (mirrored in the backend).
const ADMIN_NUMBER_PATTERN = /^AD-\d{4}-\d{4}$/i
// Mirrors the backend's email regex so typos are caught before submit.
const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export function SetupForm() {
  // "form" | "created" | "exists" — the backend only allows one admin ever.
  const [status, setStatus] = useState<"form" | "created" | "exists">("form")
  const [adminNumber, setAdminNumber] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError("")

    const trimmedNumber = adminNumber.trim()
    if (!ADMIN_NUMBER_PATTERN.test(trimmedNumber)) {
      setError("Admin number must follow the format AD-YYYY-0001 (e.g. AD-2026-0001).")
      return
    }
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError("Enter a valid email address.")
      return
    }

    setLoading(true)
    try {
      await createAdminAccount({ admin_number: trimmedNumber, email_address: email.trim(), password })
      toast.success("Admin account created")
      setStatus("created")
    } catch (err) {
      if (err instanceof ApiError && err.status === 406) {
        // The endpoint rejects any request once an admin already exists.
        setStatus("exists")
      } else if (err instanceof ApiError && err.status === 0) {
        setError("Unable to reach the server. Check your connection and try again.")
      } else {
        setError("Couldn't create the account. Check the details and try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  if (status !== "form") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-muted/30 px-6 py-12">
        <div className="w-full max-w-[420px] text-center">
          <div className="mb-8 flex justify-center">
            <Brand />
          </div>
          <Card className="border-border/70 shadow-xl shadow-primary/5">
            <CardHeader>
              <CardTitle className="text-lg">
                {status === "created" ? "Admin account created" : "Admin already exists"}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                {status === "created"
                  ? "Your administrator account is ready. Sign in with your staff number and password."
                  : "This workspace already has an administrator account, so a new one can't be created."}
              </p>
              <Button render={<Link href="/login" />} nativeButton={false} className="w-full">
                Go to sign in
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-6 py-12">
      <div className="w-full max-w-[420px]">
        <div className="mb-8 flex flex-col items-center gap-4">
          <Brand />
          <div className="mt-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Set up MicroRootsKe</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Create the one-time administrator account for this workspace.
            </p>
          </div>
        </div>

        <Card className="border-border/70 shadow-xl shadow-primary/5">
          <CardHeader className="gap-1 pb-5">
            <CardTitle className="text-lg">Administrator account</CardTitle>
            <p className="text-sm text-muted-foreground">
              This can only be done once. You&apos;ll use these credentials to sign in.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="admin_number">Admin number</Label>
                <Input
                  id="admin_number"
                  placeholder="AD-2026-0001"
                  value={adminNumber}
                  onChange={(e) => setAdminNumber(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">Format: AD-YYYY-####</p>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@microrootske.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Choose a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm font-medium text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating account…" : "Create admin account"}
              </Button>
            </form>
          </CardContent>
        </Card>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Already set up?{" "}
          <a href="/login" className="font-medium text-foreground underline underline-offset-2">
            Sign in
          </a>
        </p>
      </div>
    </main>
  )
}
