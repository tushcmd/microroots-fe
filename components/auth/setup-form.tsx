"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { checkAdminProfile, createAdminProfile } from "@/lib/api"
import { Brand } from "@/components/layout/brand"

type Status = "checking" | "exists" | "needs-setup" | "created"

export function SetupForm() {
  const [status, setStatus] = useState<Status>("checking")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    checkAdminProfile()
      .then((exists) => setStatus(exists ? "exists" : "needs-setup"))
      .catch(() => setError("Couldn't reach the server to check setup status."))
  }, [])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError("")
    try {
      await createAdminProfile(email)
      setStatus("created")
    } catch {
      setError("Couldn't create the admin account. The email may already be in use.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-6 py-12">
      <div className="w-full max-w-[440px]">
        <div className="mb-8 flex flex-col items-center gap-4">
          <Brand />
        </div>

        <Card className="border-border/70 shadow-xl shadow-primary/5">
          {status === "checking" && (
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              Checking setup status…
            </CardContent>
          )}

          {status === "exists" && (
            <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
              <CardTitle className="text-lg">An admin account already exists</CardTitle>
              <p className="text-sm text-muted-foreground">
                Setup has already been completed for this instance.
              </p>
              <Button className="mt-2" onClick={() => (window.location.href = "/login")}>
                Go to sign in
              </Button>
            </CardContent>
          )}

          {status === "needs-setup" && (
            <>
              <CardHeader className="gap-1 pb-5">
                <CardTitle className="text-lg">Create the admin account</CardTitle>
                <p className="text-sm text-muted-foreground">
                  No admin exists yet. Enter an email to generate the first account — a staff
                  number and password will be emailed to it.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="admin-email">Email address</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="admin@microroots.ke"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  {error && <p className="text-sm font-medium text-destructive">{error}</p>}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Creating…" : "Create admin account"}
                  </Button>
                </form>
              </CardContent>
            </>
          )}

          {status === "created" && (
            <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
              <CardTitle className="text-lg">Admin account created</CardTitle>
              <p className="text-sm text-muted-foreground">
                Credentials were emailed to <span className="font-medium">{email}</span>. If
                you're running the backend locally with the console email backend, check the
                server terminal instead of the inbox.
              </p>
              <Button className="mt-2" onClick={() => (window.location.href = "/login")}>
                Go to sign in
              </Button>
            </CardContent>
          )}
        </Card>
      </div>
    </main>
  )
}
