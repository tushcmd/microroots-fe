import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import {
  TOKEN_COOKIE,
  SESSION_COOKIE,
  getBackendUrl,
  isAllowedProxyPath,
  isInvalidTokenResponse,
  originAllowed,
  sessionCookieOptions,
  shouldClearTokenAfterSuccess,
  tokenCookieOptions,
} from "@/lib/server/backend"

type Ctx = { params: Promise<{ path: string[] }> }

async function proxy(request: Request, ctx: Ctx) {
  if (!originAllowed(request)) {
    return NextResponse.json({ message: "Forbidden origin" }, { status: 403 })
  }

  const { path } = await ctx.params
  if (!isAllowedProxyPath(path)) {
    return NextResponse.json({ message: "Not found" }, { status: 404 })
  }

  const jar = await cookies()
  const token = jar.get(TOKEN_COOKIE)?.value
  if (!token) {
    return NextResponse.json({ message: "Not signed in" }, { status: 401 })
  }

  const url = new URL(request.url)
  const backendPath = `/${path.join("/")}/`
  const target = `${getBackendUrl()}${backendPath}${url.search}`

  const headers = new Headers()
  const contentType = request.headers.get("content-type")
  if (contentType) headers.set("content-type", contentType)
  const accept = request.headers.get("accept")
  if (accept) headers.set("accept", accept)
  headers.set("authorization", `Token ${token}`)

  let body: ArrayBuffer | undefined
  if (request.method !== "GET" && request.method !== "HEAD") {
    body = await request.arrayBuffer()
  }

  let upstream: Response
  try {
    upstream = await fetch(target, {
      method: request.method,
      headers,
      body,
      cache: "no-store",
      redirect: "manual",
    })
  } catch {
    return NextResponse.json({ message: "Unable to reach the server." }, { status: 502 })
  }

  const respHeaders = new Headers()
  const respContentType = upstream.headers.get("content-type")
  if (respContentType) respHeaders.set("content-type", respContentType)
  const location = upstream.headers.get("location")
  if (location) respHeaders.set("location", location)

  const buf = await upstream.arrayBuffer()
  const text = new TextDecoder().decode(buf)

  if (isInvalidTokenResponse(upstream.status, text)) {
    jar.set(TOKEN_COOKIE, "", { ...tokenCookieOptions(), maxAge: 0 })
    jar.set(SESSION_COOKIE, "", { ...sessionCookieOptions(), maxAge: 0 })
  }

  if (upstream.ok && shouldClearTokenAfterSuccess(path)) {
    jar.set(TOKEN_COOKIE, "", { ...tokenCookieOptions(), maxAge: 0 })
    jar.set(SESSION_COOKIE, "", { ...sessionCookieOptions(), maxAge: 0 })
  }

  return new NextResponse(buf, { status: upstream.status, headers: respHeaders })
}

export const GET = proxy
export const POST = proxy
export const DELETE = proxy
export const PATCH = proxy
export const PUT = proxy
