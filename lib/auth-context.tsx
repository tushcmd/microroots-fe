"use client"

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import type { Session } from "./types"
import { getSession, staffLogout, setAuthExpiredHandler } from "./api"

interface AuthContextValue {
  session: Session | null
  isLoading: boolean
  login: (session: Session) => void
  logout: () => void
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

const OLD_KEYS = ["microroots_session", "microroots.session"]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const refresh = useCallback(async () => {
    const s = await getSession()
    setSession(s)
  }, [])

  const logout = useCallback(() => {
    setSession(null)
    void staffLogout().finally(() => {
      router.replace("/login")
      router.refresh()
    })
  }, [router])

  useEffect(() => {
    for (const k of OLD_KEYS) {
      try {
        window.localStorage.removeItem(k)
      } catch {}
    }
    let cancelled = false
    ;(async () => {
      const s = await getSession()
      if (!cancelled) {
        setSession(s)
        setIsLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    setAuthExpiredHandler(() => {
      setSession(null)
      router.replace("/login")
    })
    return () => setAuthExpiredHandler(null)
  }, [router])

  const login = useCallback((next: Session) => {
    setSession(next)
  }, [])

  return (
    <AuthContext.Provider value={{ session, isLoading, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>")
  return ctx
}
