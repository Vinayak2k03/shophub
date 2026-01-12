import Link from "next/link";
import { getAllOrders } from "@/server/order-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDate } from "@/lib/utils";
import { Package, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Manage Orders - Admin",
  description: "View and manage all customer orders",
};

const statusColors = {
  PENDING: "secondary",
  PROCESSING: "default",
  SHIPPED: "default",
  DELIVERED: "default",
  CANCELLED: "destructive",
} as const;

export default async function AdminOrdersPage() {
  const result = await getAllOrders();

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

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Orders Management</h1>
        <p className="text-muted-foreground">View and manage all customer orders</p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
            <p className="text-muted-foreground">Orders will appear here once customers make purchases</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {order.user.name} ({order.user.email})
                    </p>
                    <p className="text-xs text-muted-foreground">
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
      )}
    </div>
  );
}
