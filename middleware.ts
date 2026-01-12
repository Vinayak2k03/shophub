import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

// Lightweight JWT verification for Edge runtime
async function verifyAuth(request: NextRequest) {
  const token = request.cookies.get("authjs.session-token")?.value || 
                request.cookies.get("__Secure-authjs.session-token")?.value

  if (!token) return null

  try {
    const secret = new TextEncoder().encode(process.env.AUTH_SECRET)
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const session = await verifyAuth(request)

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/auth/signin", request.url))
    }
    if (session.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  // Protect user routes
  if (pathname.startsWith("/cart") || pathname.startsWith("/orders")) {
    if (!session) {
      return NextResponse.redirect(new URL("/auth/signin", request.url))
    }
  }

  // Redirect authenticated users away from auth pages
  if (pathname.startsWith("/auth") && session) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/cart/:path*",
    "/orders/:path*",
    "/auth/:path*",
  ],
}
