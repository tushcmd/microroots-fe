"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ApiError, staffLogin } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { Brand } from "@/components/layout/brand"

export function LoginForm() {
  const router = useRouter()
  const { login } = useAuth()
  const [staffNumber, setStaffNumber] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError("")
    setLoading(true)
    try {
      const session = await staffLogin(staffNumber, password)
      login(session)
      toast.success("Signed in")
      router.push("/dashboard")
    } catch (err) {
      if (err instanceof ApiError && err.status === 406) {
        setError("Invalid credentials")
      } else if (err instanceof ApiError && err.status === 0) {
        setError("Unable to reach the server. Check your connection and try again.")
      } else {
        setError("Something went wrong. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-6 py-12">
      <div className="w-full max-w-[420px]">
        <div className="mb-8 flex flex-col items-center gap-4">
          <Brand />
          <div className="mt-2 text-center">
            <h1 className="text-2xl font-medium tracking-tight">Welcome back</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign in to manage your farm operations
            </p>
          </div>
        </div>

        <Card className="border-border/70 shadow-xl shadow-primary/5">
          <CardHeader className="gap-1 pb-5">
            <CardTitle className="text-lg">Staff sign in</CardTitle>
            <p className="text-sm text-muted-foreground">Use your MicroRootsKe staff credentials.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="staff_number">Staff number</Label>
                <Input
                  id="staff_number"
                  placeholder="e.g. MRK001"
                  value={staffNumber}
                  onChange={(e) => setStaffNumber(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm font-medium text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in…" : "Sign in"}
              </Button>
            </form>
          </CardContent>
        </Card>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          First time setting this up?{" "}
          <a href="/setup" className="font-medium text-foreground underline underline-offset-2">
            Create the admin account
          </a>
        </p>
      </div>
    </main>
  )
}
