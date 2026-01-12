"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { createOrder } from "@/server/order-actions";
import { toast } from "sonner";

export function CheckoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const result = await createOrder();

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Order placed successfully!");
        router.push(`/orders/${result.order?.id}`);
      }
    } catch (error) {
      toast.error("Failed to place order");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      className="w-full" 
      size="lg"
      onClick={handleCheckout}
      disabled={isLoading}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Proceed to Checkout
    </Button>
  );
}
