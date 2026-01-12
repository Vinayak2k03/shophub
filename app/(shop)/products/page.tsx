import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/server/product-actions";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/utils";
import { Package } from "lucide-react";
import { AddToCartButton } from "@/components/add-to-cart-button";

export const metadata = {
  title: "Products - ShopHub",
  description: "Browse our collection of amazing products",
};

function ProductSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-square" />
      <CardContent className="p-4 space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
      <CardFooter className="p-4 pt-0 gap-2">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-10" />
      </CardFooter>
    </Card>
  );
}

export default async function ProductsPage() {
  const result = await getProducts();

  if (result.error || !result.products) {
    return (
      <main className="flex-1">
        <div className="container py-12">
          <div className="text-center">
            <p className="text-muted-foreground">Failed to load products</p>
          </div>
        </div>
      </main>
    );
  }

  const products = result.products;

  if (products.length === 0) {
    return (
      <main className="flex-1">
        <div className="container py-12">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold">No products available</h2>
            <p className="text-muted-foreground">
              Check back later for new arrivals
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1">
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">All Products</h1>
          <p className="text-muted-foreground">
            Discover our curated collection of premium products
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
          <Card key={product.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
            <Link href={`/products/${product.id}`}>
              <div className="aspect-square relative overflow-hidden bg-muted">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white font-semibold">Out of Stock</span>
                  </div>
                )}
              </div>
            </Link>
            <CardContent className="p-4">
              <Link href={`/products/${product.id}`}>
                <h3 className="font-semibold text-lg mb-1 line-clamp-1 hover:text-primary transition-colors">
                  {product.name}
                </h3>
              </Link>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {product.description}
              </p>
              <p className="text-xl font-bold text-primary">
                {formatPrice(product.price)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </p>
            </CardContent>
            <CardFooter className="p-4 pt-0 gap-2">
              <Button variant="outline" className="flex-1" asChild>
                <Link href={`/products/${product.id}`}>View Details</Link>
              </Button>
              <AddToCartButton productId={product.id} disabled={product.stock === 0} />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
    </main>
  );
}
