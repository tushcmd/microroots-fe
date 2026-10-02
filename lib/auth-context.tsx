"use client"

// NOTE: session is persisted to localStorage for now, which is fine to get
// the app working end to end but exposes the token to any script running on
// the page (XSS risk). Before this goes further than internal testing,
// move the token into an httpOnly cookie set by a Next.js route handler
// instead of reading/writing it from client components.

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { Session } from "./types"

const STORAGE_KEY = "microroots.session"

// DEV-ONLY BYPASS: set NEXT_PUBLIC_SKIP_AUTH=true in .env.local to skip the
// login screen entirely while building UI. A fake session is seeded so the
// auth guard in app/(dashboard)/layout.tsx never redirects to /login, and
// every data-fetching component already falls back to its mock data when
// an API call with this fake token fails — so pages render fully without a
// backend. DELETE this block (or unset the env var) before connecting to
// the real API or sharing a build with anyone outside dev.
const DEV_SKIP_AUTH = process.env.NEXT_PUBLIC_SKIP_AUTH === "true"
const DEV_SESSION: Session = { name: "Dev User", role: "Developer", token: "dev-fake-token" }

interface AuthContextValue {
  session: Session | null
  isLoading: boolean
  login: (session: Session) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (DEV_SKIP_AUTH) {
      setSession(DEV_SESSION)
      setIsLoading(false)
      return
    }
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) setSession(JSON.parse(raw))
    } catch {
      // corrupted or inaccessible storage — treat as logged out
    } finally {
      setIsLoading(false)
    }
  }, [])

  function login(next: Session) {
    setSession(next)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  function logout() {
    setSession(null)
    window.localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <AuthContext.Provider value={{ session, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
