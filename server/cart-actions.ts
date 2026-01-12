"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { cartItemSchema, updateCartItemSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function getCart() {
  try {
    const session = await auth();

    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    // Ensure user exists in database (important for OAuth users)
    const userExists = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!userExists) {
      return { error: "User not found" };
    }

    let cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Create cart if it doesn't exist
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: session.user.id },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    }

    return { success: true, cart };
  } catch (error) {
    console.error("Get cart error:", error);
    return { error: "Failed to fetch cart" };
  }
}

export async function addToCart(data: z.infer<typeof cartItemSchema>) {
  try {
    const session = await auth();

    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    const validated = cartItemSchema.parse(data);

    // Check if product exists and has enough stock
    const product = await prisma.product.findUnique({
      where: { id: validated.productId },
    });

    if (!product) {
      return { error: "Product not found" };
    }

    if (product.stock < validated.quantity) {
      return { error: "Insufficient stock" };
    }

    // Get or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: session.user.id },
      });
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: validated.productId,
        },
      },
    });

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + validated.quantity;

      if (product.stock < newQuantity) {
        return { error: "Insufficient stock" };
      }

      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      // Add new item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: validated.productId,
          quantity: validated.quantity,
        },
      });
    }

    revalidatePath("/cart");

    return { success: true };
  } catch (error) {
    console.error("Add to cart error:", error);
    if (error instanceof z.ZodError) {
      return { error: error.issues[0]?.message || "Validation error" };
    }
    return { error: "Failed to add item to cart" };
  }
}

export async function updateCartItem(data: z.infer<typeof updateCartItemSchema>) {
  try {
    const session = await auth();

    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    const validated = updateCartItemSchema.parse(data);

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: validated.cartItemId },
      include: { product: true, cart: true },
    });

    if (!cartItem) {
      return { error: "Cart item not found" };
    }

    if (cartItem.cart.userId !== session.user.id) {
      return { error: "Unauthorized" };
    }

    if (cartItem.product.stock < validated.quantity) {
      return { error: "Insufficient stock" };
    }

    await prisma.cartItem.update({
      where: { id: validated.cartItemId },
      data: { quantity: validated.quantity },
    });

    revalidatePath("/cart");

    return { success: true };
  } catch (error) {
    console.error("Update cart item error:", error);
    if (error instanceof z.ZodError) {
      return { error: error.issues[0]?.message || "Validation error" };
    }
    return { error: "Failed to update cart item" };
  }
}

export async function removeFromCart(cartItemId: string) {
  try {
    const session = await auth();

    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true },
    });

    if (!cartItem) {
      return { error: "Cart item not found" };
    }

    if (cartItem.cart.userId !== session.user.id) {
      return { error: "Unauthorized" };
    }

    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    revalidatePath("/cart");

    return { success: true };
  } catch (error) {
    console.error("Remove from cart error:", error);
    return { error: "Failed to remove item from cart" };
  }
}

export async function clearCart() {
  try {
    const session = await auth();

    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
    });

    if (!cart) {
      return { success: true };
    }

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    revalidatePath("/cart");

    return { success: true };
  } catch (error) {
    console.error("Clear cart error:", error);
    return { error: "Failed to clear cart" };
  }
}
