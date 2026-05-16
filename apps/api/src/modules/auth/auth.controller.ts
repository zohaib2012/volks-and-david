import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { success, error } from "../../utils/response";
import * as authService from "./auth.service";
import { prisma } from "../../config/database";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.register(req.body);
  return success(res, result, "Registration successful", 201);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.login(req.body.email, req.body.password);
  return success(res, result, "Login successful");
});

export const sendOtp = asyncHandler(async (req: Request, res: Response) => {
  await authService.sendOtp(req.body.target, req.body.type);
  return success(res, null, "OTP sent successfully");
});

export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.verifyOtp(
    req.body.target,
    req.body.code,
    req.body.type,
  );
  return success(res, result, "OTP verified successfully");
});

export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await authService.refreshToken(req.body.refreshToken);
    return success(res, result, "Token refreshed");
  },
);

export const logout = asyncHandler(async (req: Request, res: Response) => {
  await authService.logout(req.user!.userId);
  return success(res, null, "Logged out successfully");
});

export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    await authService.forgotPassword(req.body.email);
    return success(res, null, "Password reset link sent");
  },
);

export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    await authService.resetPassword(req.body.token, req.body.password);
    return success(res, null, "Password reset successful");
  },
);

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.getProfile(req.user!.userId);
  return success(res, user);
});

export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword)
    return error(res, "Both fields are required", 400);
  if (newPassword.length < 8)
    return error(res, "Password must be at least 8 characters", 400);

  const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
  if (!user) return error(res, "User not found", 404);

  const bcrypt = await import("bcryptjs");
  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) return error(res, "Current password is incorrect", 401);

  const hash = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({ where: { id: user.id }, data: { password: hash } });
  return success(res, null, "Password changed successfully");
});
