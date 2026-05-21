import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "../../config/database";
import {
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt";
import type { UserRole } from "@prisma/client";
import { env } from "../../config/env";
import {
  sendEmailVerifyOtp,
  sendPasswordResetOtp,
  sendAdminLoginOtp,
} from "../../utils/email";

function generateReferralCode(): string {
  return "VND" + crypto.randomBytes(4).toString("hex").toUpperCase();
}

interface RegisterInput {
  email: string;
  password: string;
  name?: string;
  phone?: string;
  referralCode?: string;
}

export async function register(input: RegisterInput) {
  const existing = await prisma.user.findUnique({
    where: { email: input.email },
  });
  if (existing) {
    throw Object.assign(new Error("Email already registered"), {
      statusCode: 409,
    });
  }

  const hashedPassword = await bcrypt.hash(input.password, 12);
  const code = generateReferralCode();

  const user = await prisma.user.create({
    data: {
      email: input.email,
      password: hashedPassword,
      name: input.name,
      phone: input.phone,
      referralCode: code,
      referredBy: input.referralCode,
    },
  });

  // Auto-send email verification OTP
  await sendOtp(user.email, "email_verify");

  const token = generateToken({ userId: user.id, role: user.role });
  const refreshToken = generateRefreshToken({
    userId: user.id,
    role: user.role,
  });

  return {
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    token,
    refreshToken,
    requiresEmailVerification: true,
  };
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.isActive) {
    throw Object.assign(new Error("Invalid credentials"), { statusCode: 401 });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw Object.assign(new Error("Invalid credentials"), { statusCode: 401 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  // Admin and super admin require 2FA OTP
  if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
    await sendOtp(user.email, "admin_2fa");
    return {
      requiresOtp: true,
      email: user.email,
    };
  }

  const token = generateToken({ userId: user.id, role: user.role });
  const refreshToken = generateRefreshToken({
    userId: user.id,
    role: user.role,
  });

  return {
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    token,
    refreshToken,
  };
}

export async function sendOtp(target: string, type: string) {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await prisma.otpCode.updateMany({
    where: { target, type, used: false },
    data: { used: true },
  });
  await prisma.otpCode.create({ data: { target, code, type, expiresAt } });

  if (type === "email_verify") {
    await sendEmailVerifyOtp(target, code);
  } else if (type === "password_reset") {
    await sendPasswordResetOtp(target, code);
  } else if (type === "admin_2fa") {
    await sendAdminLoginOtp(target, code);
  } else {
    console.log(`[OTP] ${type} for ${target}: ${code}`);
  }

  return { sent: true };
}

export async function verifyOtp(target: string, code: string, type: string) {
  const otp = await prisma.otpCode.findFirst({
    where: { target, code, type, used: false, expiresAt: { gt: new Date() } },
  });
  if (!otp) throw Object.assign(new Error("Invalid or expired OTP"), { statusCode: 400 });

  await prisma.otpCode.update({ where: { id: otp.id }, data: { used: true } });

  if (type === "email_verify") {
    await prisma.user.update({ where: { email: target }, data: { isEmailVerified: true } });
  }

  if (type === "phone_verify") {
    const user = await prisma.user.findFirst({ where: { phone: target } });
    if (user) {
      await prisma.user.update({ where: { id: user.id }, data: { isPhoneVerified: true } });
    }
  }

  // For password reset, generate a one-time reset token
  if (type === "password_reset") {
    const user = await prisma.user.findUnique({ where: { email: target } });
    if (!user) throw Object.assign(new Error("User not found"), { statusCode: 404 });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await prisma.passwordResetToken.updateMany({
      where: { userId: user.id, used: false },
      data: { used: true },
    });
    await prisma.passwordResetToken.create({
      data: { userId: user.id, token: resetToken, expiresAt },
    });
    return { verified: true, resetToken };
  }

  return { verified: true };
}

// Called after admin enters OTP — returns JWT tokens
export async function verifyLoginOtp(email: string, code: string) {
  const otp = await prisma.otpCode.findFirst({
    where: { target: email, code, type: "admin_2fa", used: false, expiresAt: { gt: new Date() } },
  });
  if (!otp) throw Object.assign(new Error("Invalid or expired OTP"), { statusCode: 400 });

  await prisma.otpCode.update({ where: { id: otp.id }, data: { used: true } });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.isActive) {
    throw Object.assign(new Error("User not found"), { statusCode: 404 });
  }

  const token = generateToken({ userId: user.id, role: user.role });
  const refreshToken = generateRefreshToken({ userId: user.id, role: user.role });

  return {
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    token,
    refreshToken,
  };
}

export async function refreshToken(token: string) {
  try {
    const decoded = verifyRefreshToken(token);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });
    if (!user || !user.isActive) {
      throw Object.assign(new Error("Invalid refresh token"), {
        statusCode: 401,
      });
    }

    const newToken = generateToken({ userId: user.id, role: user.role });
    const newRefreshToken = generateRefreshToken({
      userId: user.id,
      role: user.role,
    });

    return { token: newToken, refreshToken: newRefreshToken };
  } catch {
    throw Object.assign(new Error("Invalid refresh token"), {
      statusCode: 401,
    });
  }
}

export async function logout(userId: string) {
  // Stateless JWT - client should discard token
}

export async function forgotPassword(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  // Always return silently (don't reveal if email exists)
  if (!user) return;

  await sendOtp(email, "password_reset");
}

export async function resetPassword(token: string, password: string) {
  const record = await prisma.passwordResetToken.findUnique({
    where: { token }, include: { user: true },
  });
  if (!record || record.used || record.expiresAt < new Date()) {
    throw Object.assign(new Error("Invalid or expired reset token"), { statusCode: 400 });
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  await prisma.$transaction([
    prisma.user.update({ where: { id: record.userId }, data: { password: hashedPassword } }),
    prisma.passwordResetToken.update({ where: { id: record.id }, data: { used: true } }),
  ]);
  return { success: true };
}

export async function getProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      isEmailVerified: true,
      isPhoneVerified: true,
      isActive: true,
      referralCode: true,
      referredBy: true,
      language: true,
      themeSettings: true,
      lastLoginAt: true,
      createdAt: true,
      profiles: true,
    },
  });

  if (!user) {
    throw Object.assign(new Error("User not found"), { statusCode: 404 });
  }

  return user;
}
