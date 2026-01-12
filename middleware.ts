import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const session = await auth()
  const { pathname } = request.nextUrl

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (!session?.user) {
      return NextResponse.redirect(new URL("/auth/signin", request.url))
    }
    if (session.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  // Protect user routes
  if (pathname.startsWith("/cart") || pathname.startsWith("/orders")) {
    if (!session?.user) {
      return NextResponse.redirect(new URL("/auth/signin", request.url))
    }
  }

  // Redirect authenticated users away from auth pages
  if (pathname.startsWith("/auth") && session?.user) {
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
