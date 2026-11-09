"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { changeMyStaffPassword } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { ProfileCard } from "@/components/settings/profile-card"

export function SettingsView() {
  const { session, logout } = useAuth()
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!session) return
    if (password !== confirm) {
      setError("Passwords don't match.")
      return
    }
    setLoading(true)
    setError("")
    try {
      await changeMyStaffPassword(password, session.token)
      // The backend revokes the current token and clears the session on a
      // successful password change, so the stored token is dead either way —
      // send the user back through login rather than leaving a stale session.
      logout()
    } catch {
      setError("Couldn't change the password. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-muted-foreground">Account</p>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      </div>
      <ProfileCard />

      <Card className="max-w-md border-border/70 shadow-none">
        <CardHeader>
          <CardTitle className="text-base">Change password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="new-password">New password</Label>
              <Input
                id="new-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="confirm-password">Confirm password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm font-medium text-destructive">{error}</p>}
            <Button type="submit" disabled={loading}>
              {loading ? "Saving…" : "Change password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
