import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import {
  TOKEN_COOKIE,
  SESSION_COOKIE,
  getBackendUrl,
  sessionCookieOptions,
  tokenCookieOptions,
} from "@/lib/server/backend"

export async function POST() {
  const jar = await cookies()
  const token = jar.get(TOKEN_COOKIE)?.value

  if (token) {
    try {
      await fetch(`${getBackendUrl()}/staff-profile/staff-logout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        cache: "no-store",
      })
    } catch {
      // ignore backend logout failure; cookie is cleared regardless
    }
  }

  jar.set(TOKEN_COOKIE, "", { ...tokenCookieOptions(), maxAge: 0 })
  jar.set(SESSION_COOKIE, "", { ...sessionCookieOptions(), maxAge: 0 })
  return NextResponse.json({ ok: true })
}
