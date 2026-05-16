import { Router } from "express";
import * as authController from "./auth.controller";
import { authLimiter } from "../../middleware/rateLimiter";
import { authenticate } from "../../middleware/auth.middleware";

const router = Router();

router.post("/register", authLimiter, authController.register);
router.post("/login", authLimiter, authController.login);
router.post("/send-otp", authLimiter, authController.sendOtp);
router.post("/verify-otp", authLimiter, authController.verifyOtp);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", authenticate, authController.logout);
router.post("/forgot-password", authLimiter, authController.forgotPassword);
router.post("/reset-password", authLimiter, authController.resetPassword);
router.get("/me", authenticate, authController.me);
router.put("/change-password", authenticate, authController.changePassword);

export default router;
