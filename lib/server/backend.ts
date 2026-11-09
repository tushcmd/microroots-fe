export const TOKEN_COOKIE = "mr_token"
export const SESSION_COOKIE = "mr_session"

const ALLOWED_SEGMENTS = new Set(["staff-profile", "products"])

export function getBackendUrl(): string {
  const url = process.env.BACKEND_URL
  if (!url) throw new Error("BACKEND_URL is not set")
  return url.replace(/\/+$/, "")
}

export function tokenCookieOptions() {
  return {
    httpOnly: true as const,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  }
}

export function sessionCookieOptions() {
  return {
    httpOnly: false as const,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  }
}

export function isAllowedProxyPath(segments: string[]): boolean {
  return segments.length > 0 && ALLOWED_SEGMENTS.has(segments[0])
}

export function encodeSession(value: unknown): string {
  return encodeURIComponent(JSON.stringify(value))
}

export function decodeSession(raw: string | undefined): { name: string | null; role: string | null; staffNumber?: string } | null {
  if (!raw) return null
  try {
    return JSON.parse(decodeURIComponent(raw))
  } catch {
    return null
  }
}

export function isInvalidTokenResponse(status: number, bodyText: string): boolean {
  if (status !== 401) return false
  try {
    const parsed = JSON.parse(bodyText)
    const detail = typeof parsed?.detail === "string" ? parsed.detail : ""
    return detail === "Invalid token." || detail === "Authentication credentials were not provided."
  } catch {
    return bodyText.includes("Invalid token") || bodyText.includes("Authentication credentials were not provided")
  }
}

export function shouldClearTokenAfterSuccess(pathSegments: string[]): boolean {
  const joined = "/" + pathSegments.join("/")
  return joined.includes("change-my-staff-password") || joined.includes("admin-set-staff-password")
}

export function originAllowed(request: Request): boolean {
  if (request.method === "GET" || request.method === "HEAD" || request.method === "OPTIONS") return true
  const origin = request.headers.get("origin")
  if (!origin) return true
  try {
    const reqUrl = new URL(request.url)
    const o = new URL(origin)
    return o.host === reqUrl.host
  } catch {
    return false
  }
}
