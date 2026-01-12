import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getOrders } from "@/server/order-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDate } from "@/lib/utils";
import { Package, ArrowRight } from "lucide-react";

export const metadata = {
  title: "My Orders - ShopHub",
  description: "View your order history",
};

const statusColors = {
  PENDING: "secondary",
  PROCESSING: "default",
  SHIPPED: "default",
  DELIVERED: "default",
  CANCELLED: "destructive",
} as const;

export default async function OrdersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const result = await getOrders();

  if (result.error || !result.orders) {
    return (
      <div className="container py-12">
        <div className="text-center">
          <p className="text-muted-foreground">Failed to load orders</p>
        </div>
      </div>
    );
  }

  const orders = result.orders;

  if (orders.length === 0) {
    return (
      <div className="container py-12">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center">
            <Package className="h-12 w-12 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-6">
              Start shopping to see your orders here
            </p>
          </div>
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-muted-foreground">Track and manage your orders</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">Order #{order.id.slice(0, 8).toUpperCase()}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Placed on {formatDate(order.createdAt)}
                  </p>
                </div>
                <Badge variant={statusColors[order.status]}>
                  {order.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {order.items.length} {order.items.length === 1 ? "item" : "items"}
                  </span>
                  <span className="text-lg font-bold text-primary">
                    {formatPrice(order.total)}
                  </span>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/orders/${order.id}`}>
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
