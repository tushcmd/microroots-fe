import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import {
  TOKEN_COOKIE,
  SESSION_COOKIE,
  decodeSession,
  encodeSession,
  getBackendUrl,
  sessionCookieOptions,
  tokenCookieOptions,
} from "@/lib/server/backend"

export async function GET() {
  const jar = await cookies()
  const token = jar.get(TOKEN_COOKIE)?.value
  if (!token) {
    return NextResponse.json({ message: "Not signed in" }, { status: 401 })
  }

  const cached = decodeSession(jar.get(SESSION_COOKIE)?.value)
  if (cached) {
    return NextResponse.json(cached)
  }

  // Fallback: derive minimal session if display cookie is missing.
  try {
    const upstream = await fetch(`${getBackendUrl()}/staff-profile/get-all-staff-profiles/`, {
      method: "GET",
      headers: { Authorization: `Token ${token}` },
      cache: "no-store",
    })
    if (upstream.status === 401) {
      jar.set(TOKEN_COOKIE, "", { ...tokenCookieOptions(), maxAge: 0 })
      jar.set(SESSION_COOKIE, "", { ...sessionCookieOptions(), maxAge: 0 })
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }
    if (upstream.ok) {
      const session = { name: null, role: null }
      jar.set(SESSION_COOKIE, encodeSession(session), sessionCookieOptions())
      return NextResponse.json(session)
    }
  } catch {
    // fall through
  }

  return NextResponse.json({ message: "Not signed in" }, { status: 401 })
}
