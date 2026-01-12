import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (!session?.user) {
      return NextResponse.redirect(new URL("/auth/signin", req.url))
    }
    if (session.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  // Protect user routes
  if (pathname.startsWith("/cart") || pathname.startsWith("/orders")) {
    if (!session?.user) {
      return NextResponse.redirect(new URL("/auth/signin", req.url))
    }
  }

  // Redirect authenticated users away from auth pages
  if (pathname.startsWith("/auth") && session?.user) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/admin/:path*",
    "/cart/:path*",
    "/orders/:path*",
    "/auth/:path*",
  ],
}

