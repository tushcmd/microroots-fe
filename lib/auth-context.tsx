"use client"

import { createContext, useCallback, useContext, useSyncExternalStore, type ReactNode } from "react"
import type { Session } from "./types"

const STORAGE_KEY = "microroots_session"

interface AuthContextValue {
  session: Session | null
  isLoading: boolean
  login: (session: Session) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

let listeners: Array<() => void> = []

function emit() {
  for (const l of listeners) l()
}

function subscribe(listener: () => void) {
  listeners = [...listeners, listener]
  return () => {
    listeners = listeners.filter((l) => l !== listener)
  }
}

function getSnapshot(): string | null {
  if (typeof window === "undefined") return null
  try {
    return window.localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function getServerSnapshot(): string | null {
  return null
}

function parseSession(raw: string | null): Session | null {
  if (!raw) return null
  try {
    return JSON.parse(raw) as Session
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const session = parseSession(raw)

  const login = useCallback((next: Session) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    emit()
  }, [])

  const logout = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY)
    emit()
  }, [])

  return (
    <AuthContext.Provider value={{ session, isLoading: false, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>")
  return ctx
}
