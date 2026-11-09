import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PROTECTED = ["/dashboard", "/staff", "/products", "/roles", "/settings"]

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isProtected = PROTECTED.some((p) => pathname === p || pathname.startsWith(p + "/"))
  if (!isProtected) return NextResponse.next()

  const token = request.cookies.get("mr_token")?.value
  if (token) return NextResponse.next()

  const url = request.nextUrl.clone()
  url.pathname = "/login"
  url.searchParams.set("next", pathname)
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ["/dashboard/:path*", "/staff/:path*", "/products/:path*", "/roles/:path*", "/settings/:path*"],
}
