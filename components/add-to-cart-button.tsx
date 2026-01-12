"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/server/cart-actions";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface AddToCartButtonProps {
  productId: string;
  disabled?: boolean;
  quantity?: number;
}

export function AddToCartButton({ productId, disabled, quantity = 1 }: AddToCartButtonProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    if (!session?.user) {
      router.push("/auth/signin");
      return;
    }

    setIsLoading(true);
    try {
      const result = await addToCart({ productId, quantity });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Added to cart!");
      }
    } catch (error) {
      toast.error("Failed to add to cart");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      size="icon"
      onClick={handleAddToCart}
      disabled={disabled || isLoading}
      aria-label="Add to cart"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <ShoppingCart className="h-4 w-4" />
      )}
    </Button>
  );
}
