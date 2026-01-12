"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signUpSchema, verifyOTPSchema, resendOTPSchema } from "@/lib/validations";
import { generateOTP, sendOTPEmail } from "@/lib/email";
import { z } from "zod";

export async function signUp(data: z.infer<typeof signUpSchema>) {
  try {
    const validated = signUpSchema.parse(data);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      return { error: "Email already registered" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validated.password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        password: hashedPassword,
      },
    });

    // Generate and store OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.oTP.create({
      data: {
        userId: user.id,
        code: otp,
        expiresAt,
      },
    });

    // Send OTP email
    const emailResult = await sendOTPEmail(validated.email, otp);

    if (!emailResult.success) {
      // Clean up user if email fails
      await prisma.user.delete({ where: { id: user.id } });
      return { error: "Failed to send verification email. Please try again." };
    }

    return { success: true, email: validated.email };
  } catch (error) {
    console.error("Sign up error:", error);
    if (error instanceof z.ZodError) {
      return { error: error.issues[0]?.message || "Validation error" };
    }
    return { error: "An error occurred during sign up" };
  }
}

export async function verifyOTP(data: z.infer<typeof verifyOTPSchema>) {
  try {
    const validated = verifyOTPSchema.parse(data);

    const user = await prisma.user.findUnique({
      where: { email: validated.email },
      include: { otp: true },
    });

    if (!user) {
      return { error: "User not found" };
    }

    if (!user.otp) {
      return { error: "No OTP found. Please request a new one." };
    }

    // Check if OTP is expired
    if (new Date() > user.otp.expiresAt) {
      await prisma.oTP.delete({ where: { userId: user.id } });
      return { error: "OTP has expired. Please request a new one." };
    }

    // Verify OTP
    if (user.otp.code !== validated.otp) {
      return { error: "Invalid OTP" };
    }

    // Mark email as verified and delete OTP
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() },
    });

    await prisma.oTP.delete({ where: { userId: user.id } });

    return { success: true };
  } catch (error) {
    console.error("Verify OTP error:", error);
    if (error instanceof z.ZodError) {
      return { error: error.issues[0]?.message || "Validation error" };
    }
    return { error: "An error occurred during verification" };
  }
}

export async function resendOTP(data: z.infer<typeof resendOTPSchema>) {
  try {
    const validated = resendOTPSchema.parse(data);

    const user = await prisma.user.findUnique({
      where: { email: validated.email },
      include: { otp: true },
    });

    if (!user) {
      return { error: "User not found" };
    }

    if (user.emailVerified) {
      return { error: "Email already verified" };
    }

    // Check cooldown (30 seconds)
    if (user.otp) {
      const timeSinceLastOTP = Date.now() - user.otp.createdAt.getTime();
      if (timeSinceLastOTP < 30000) {
        const remainingSeconds = Math.ceil((30000 - timeSinceLastOTP) / 1000);
        return { error: `Please wait ${remainingSeconds} seconds before requesting a new OTP` };
      }
    }

    // Generate new OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Delete old OTP and create new one
    if (user.otp) {
      await prisma.oTP.delete({ where: { userId: user.id } });
    }

    await prisma.oTP.create({
      data: {
        userId: user.id,
        code: otp,
        expiresAt,
      },
    });

    // Send OTP email
    const emailResult = await sendOTPEmail(validated.email, otp);

    if (!emailResult.success) {
      return { error: "Failed to send verification email. Please try again." };
    }

    return { success: true };
  } catch (error) {
    console.error("Resend OTP error:", error);
    if (error instanceof z.ZodError) {
      return { error: error.issues[0]?.message || "Validation error" };
    }
    return { error: "An error occurred while resending OTP" };
  }
}
