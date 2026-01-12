"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Package, User, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { signOut, useSession } from "next-auth/react";

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <Package className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              ShopHub
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {session?.user?.role === "ADMIN" ? (
              <>
                <Link
                  href="/admin"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname.startsWith("/admin") ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/products"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname.startsWith("/admin/products") ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  Products
                </Link>
                <Link
                  href="/admin/orders"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname.startsWith("/admin/orders") ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  Orders
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/products"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive("/products") ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  Products
                </Link>
                {session?.user && (
                  <Link
                    href="/orders"
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      isActive("/orders") ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    Orders
                  </Link>
                )}
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          {session?.user ? (
            <>
              {session.user.role !== "ADMIN" && (
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/cart">
                    <ShoppingCart className="h-5 w-5" />
                  </Link>
                </Button>
              )}
              
              <div className="hidden md:flex items-center gap-2 ml-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4" />
                  <span className="text-muted-foreground">{session.user.name || session.user.email}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </>
          ) : (
            <Button asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
