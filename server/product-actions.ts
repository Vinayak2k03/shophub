"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { productSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, products };
  } catch (error) {
    console.error("Get products error:", error);
    return { error: "Failed to fetch products" };
  }
}

export async function getProduct(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return { error: "Product not found" };
    }

    return { success: true, product };
  } catch (error) {
    console.error("Get product error:", error);
    return { error: "Failed to fetch product" };
  }
}

export async function createProduct(data: z.infer<typeof productSchema>) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return { error: "Unauthorized" };
    }

    const validated = productSchema.parse(data);

    const product = await prisma.product.create({
      data: validated,
    });

    revalidatePath("/admin/products");
    revalidatePath("/products");

    return { success: true, product };
  } catch (error) {
    console.error("Create product error:", error);
    if (error instanceof z.ZodError) {
      return { error: error.issues[0]?.message || "Validation error" };
    }
    return { error: "Failed to create product" };
  }
}

export async function updateProduct(
  id: string,
  data: z.infer<typeof productSchema>
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return { error: "Unauthorized" };
    }

    const validated = productSchema.parse(data);

    const product = await prisma.product.update({
      where: { id },
      data: validated,
    });

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath(`/products/${id}`);

    return { success: true, product };
  } catch (error) {
    console.error("Update product error:", error);
    if (error instanceof z.ZodError) {
      return { error: error.issues[0]?.message || "Validation error" };
    }
    return { error: "Failed to update product" };
  }
}

export async function deleteProduct(id: string) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return { error: "Unauthorized" };
    }

    await prisma.product.delete({
      where: { id },
    });

    revalidatePath("/admin/products");
    revalidatePath("/products");

    return { success: true };
  } catch (error) {
    console.error("Delete product error:", error);
    return { error: "Failed to delete product" };
  }
}
