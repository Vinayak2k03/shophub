import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProduct } from "@/server/product-actions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { ArrowLeft, Package } from "lucide-react";
import { AddToCartButton } from "@/components/add-to-cart-button";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getProduct(id);
  
  if (!result.product) {
    return { title: "Product Not Found" };
  }

  return {
    title: `${result.product.name} - ShopHub`,
    description: result.product.description,
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getProduct(id);

  if (result.error || !result.product) {
    notFound();
  }

  const product = result.product;
  const inStock = product.stock > 0;

  return (
    <div className="container py-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/products">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Link>
      </Button>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Image */}
        <Card className="overflow-hidden">
          <div className="aspect-square relative bg-muted">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {!inStock && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <Badge variant="destructive" className="text-lg px-6 py-2">
                  Out of Stock
                </Badge>
              </div>
            )}
          </div>
        </Card>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-3xl font-bold text-primary mb-4">
              {formatPrice(product.price)}
            </p>
            <div className="flex items-center gap-2 mb-4">
              <Badge variant={inStock ? "default" : "destructive"}>
                {inStock ? `${product.stock} in stock` : "Out of stock"}
              </Badge>
            </div>
          </div>

          <Card>
            <CardContent className="p-6">
              <h2 className="font-semibold mb-2">Product Description</h2>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <div className="flex gap-3">
              <AddToCartButton 
                productId={product.id} 
                disabled={!inStock}
              />
              <Button 
                size="lg" 
                className="flex-1"
                disabled={!inStock}
                asChild={inStock}
              >
                {inStock ? (
                  <Link href="/cart">Buy Now</Link>
                ) : (
                  <>
                    <Package className="mr-2 h-4 w-4" />
                    Out of Stock
                  </>
                )}
              </Button>
            </div>
            
            {!inStock && (
              <p className="text-sm text-muted-foreground text-center">
                This product is currently unavailable. Check back later!
              </p>
            )}
          </div>

          <Card className="bg-muted/50">
            <CardContent className="p-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">SKU:</span>
                <span className="font-mono">{product.id.slice(0, 8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Category:</span>
                <span>Electronics</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Availability:</span>
                <span className={inStock ? "text-green-600" : "text-red-600"}>
                  {inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
