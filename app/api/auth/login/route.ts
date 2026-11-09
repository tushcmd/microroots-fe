import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import {
  TOKEN_COOKIE,
  SESSION_COOKIE,
  encodeSession,
  getBackendUrl,
  sessionCookieOptions,
  tokenCookieOptions,
} from "@/lib/server/backend"

type LoginBody = { staff_number?: string; password?: string }
type LoginResponse = {
  payload?: { user_token?: string; full_name?: string | null; user_role?: string | null }
  message?: string
}

export async function POST(request: Request) {
  let body: LoginBody
  try {
    body = (await request.json()) as LoginBody
  } catch {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 })
  }

  let upstream: Response
  try {
    upstream = await fetch(`${getBackendUrl()}/staff-profile/staff-login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        staff_number: body.staff_number,
        password: body.password,
      }),
      cache: "no-store",
    })
  } catch {
    return NextResponse.json({ message: "Unable to reach the server." }, { status: 502 })
  }

  const text = await upstream.text()
  let data: LoginResponse | null = null
  try {
    data = text ? (JSON.parse(text) as LoginResponse) : null
  } catch {
    data = null
  }

  if (!upstream.ok) {
    return new NextResponse(text || JSON.stringify({ message: upstream.statusText }), {
      status: upstream.status,
      headers: { "content-type": upstream.headers.get("content-type") || "application/json" },
    })
  }

  const token = data?.payload?.user_token
  if (!token) {
    return NextResponse.json({ message: "Malformed login response" }, { status: 500 })
  }

  const session = {
    name: data?.payload?.full_name ?? null,
    role: data?.payload?.user_role ?? null,
    staffNumber: typeof body.staff_number === "string" ? body.staff_number.trim() : undefined,
  }

  const jar = await cookies()
  jar.set(TOKEN_COOKIE, token, tokenCookieOptions())
  jar.set(SESSION_COOKIE, encodeSession(session), sessionCookieOptions())

  return NextResponse.json(session)
}
