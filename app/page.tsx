import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Package, Shield, Zap, ShoppingBag } from "lucide-react";
import { auth } from "@/lib/auth";
import { Header } from "@/components/header";

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-32">
          <div className="container relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm mb-6 animate-fade-in">
                <Zap className="mr-2 h-4 w-4 text-primary" />
                <span>Production-Ready E-Commerce Platform</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent animate-slide-in">
                Welcome to ShopHub
              </h1>
              <p className="text-lg text-muted-foreground mb-8 animate-slide-in">
                Experience seamless online shopping with our modern, secure, and user-friendly platform.
                Built with cutting-edge technology for the best performance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-in">
                <Button size="lg" asChild>
                  <Link href="/products">
                    Browse Products
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                {!session && (
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/auth/signin">Sign In</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Background Gradient */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 to-transparent" />
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose ShopHub?</h2>
              <p className="text-muted-foreground">
                We provide a seamless shopping experience with enterprise-grade security and performance.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="pt-6">
                  <div className="rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Secure Authentication</h3>
                  <p className="text-muted-foreground">
                    Multiple authentication options including Google OAuth and email verification with OTP.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="pt-6">
                  <div className="rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
                  <p className="text-muted-foreground">
                    Built with Next.js 15 and React 19 for optimal performance and user experience.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="pt-6">
                  <div className="rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center mb-4">
                    <ShoppingBag className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Easy Shopping</h3>
                  <p className="text-muted-foreground">
                    Intuitive cart management and streamlined checkout process for effortless shopping.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container">
            <Card className="bg-gradient-to-r from-primary to-purple-600 border-0 text-primary-foreground">
              <CardContent className="p-12 text-center">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-90" />
                <h2 className="text-3xl font-bold mb-4">Ready to Start Shopping?</h2>
                <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                  Join thousands of satisfied customers and discover amazing products at great prices.
                </p>
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/products">
                    Explore Products
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <span className="font-semibold">ShopHub</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 ShopHub. Built with Next.js and TypeScript.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
