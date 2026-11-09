"use client"

import { useState, type FormEvent, type ReactNode } from "react"
import { toast } from "sonner"
import { PageHeader, PageRoot } from "@/components/pages/shared/page-chrome"
import { ProfileCard } from "@/components/settings/profile-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { changeMyStaffPassword } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { notifyError } from "@/lib/notify"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/shared/theme-toggle"

const sections = [
  { id: "profile", label: "Profile", description: "Your name and photo." },
  { id: "security", label: "Security", description: "Your password and sign-in." },
  { id: "appearance", label: "Appearance", description: "Theme and display preferences." },
] as const
type SectionId = (typeof sections)[number]["id"]

function SettingsRow({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string
  hint?: string
  htmlFor?: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-2 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="min-w-0 sm:max-w-[45%]">
        {htmlFor ? (
          <Label htmlFor={htmlFor} className="text-sm font-medium">
            {label}
          </Label>
        ) : (
          <p className="text-sm font-medium">{label}</p>
        )}
        {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
      </div>
      <div className="sm:w-[280px]">{children}</div>
    </div>
  )
}

export function SettingsView() {
  const { session, logout } = useAuth()
  const [active, setActive] = useState<SectionId>("profile")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)

  async function handlePassword(event: FormEvent) {
    event.preventDefault()
    if (!session) return
    if (password !== confirm) {
      toast.error("Passwords don't match.")
      return
    }
    setLoading(true)
    try {
      await changeMyStaffPassword(password)
      toast.success("Password changed. Please sign in again.")
      logout()
    } catch (e) {
      notifyError(e, "Couldn't change the password. Try again.")
    } finally {
      setLoading(false)
    }
  }

  const section = sections.find((s) => s.id === active)!

  return (
    <PageRoot>
      <PageHeader eyebrow="Account" title="Settings" />

      <div className="flex flex-col gap-5 md:flex-row md:gap-10">
        <nav className="-mx-1 flex gap-1 overflow-x-auto px-1 md:mx-0 md:w-44 md:shrink-0 md:flex-col md:overflow-visible md:px-0">
          {sections.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActive(s.id)}
              className={cn(
                "whitespace-nowrap rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors md:py-2",
                active === s.id
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
            >
              {s.label}
            </button>
          ))}
        </nav>

        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold">{section.label}</h2>
          <p className="mb-4 mt-0.5 text-sm text-muted-foreground">{section.description}</p>

          {active === "profile" && <ProfileCard />}

          {active === "security" && (
            <form onSubmit={handlePassword}>
              <Card className="border-border/70 shadow-none">
                <CardContent className="divide-y p-0">
                  <SettingsRow
                    htmlFor="new-password"
                    label="New password"
                    hint="You'll be signed out after changing it."
                  >
                    <Input
                      id="new-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </SettingsRow>
                  <SettingsRow htmlFor="confirm-password" label="Confirm password">
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      required
                    />
                  </SettingsRow>
                  <div className="flex justify-end px-4 py-3">
                    <Button type="submit" disabled={loading || !password}>
                      {loading ? "Saving…" : "Change password"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          )}

          {active === "appearance" && (
            <Card className="border-border/70 shadow-none">
              <CardContent className="divide-y p-0">
                <SettingsRow label="Theme" hint="Choose light, dark, or follow your system.">
                  <ThemeToggle />
                </SettingsRow>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageRoot>
  )
}
