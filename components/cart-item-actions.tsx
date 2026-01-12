"use client";

import { useState } from "react";
import { Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateCartItem, removeFromCart } from "@/server/cart-actions";
import { toast } from "sonner";

interface CartItemActionsProps {
  cartItemId: string;
  quantity: number;
  maxStock: number;
}

export function CartItemActions({ cartItemId, quantity, maxStock }: CartItemActionsProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > maxStock) return;
    
    setIsUpdating(true);
    try {
      const result = await updateCartItem({ cartItemId, quantity: newQuantity });

      if (result.error) {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Failed to update quantity");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      const result = await removeFromCart(cartItemId);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Item removed from cart");
      }
    } catch (error) {
      toast.error("Failed to remove item");
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center border rounded-md">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => handleUpdateQuantity(quantity - 1)}
          disabled={quantity <= 1 || isUpdating}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="w-10 text-center text-sm font-medium">
          {isUpdating ? <Loader2 className="h-3 w-3 animate-spin mx-auto" /> : quantity}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => handleUpdateQuantity(quantity + 1)}
          disabled={quantity >= maxStock || isUpdating}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-destructive hover:text-destructive"
        onClick={handleRemove}
        disabled={isRemoving}
      >
        {isRemoving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
