import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { asyncHandler } from "../../utils/asyncHandler";
import { success } from "../../utils/response";
import { prisma } from "../../config/database";

const router = Router();
router.use(authenticate);

router.get(
  "/stats",
  asyncHandler(async (req, res) => {
    const userId = req.user!.userId;
    const now = new Date();
    const currentYear = now.getFullYear();

    const [
      totalReturns,
      pendingReturns,
      ntnCount,
      recentPayments,
      activeProfile,
      recentActivity,
    ] = await Promise.all([
      prisma.taxReturn.count({ where: { userId } }),
      prisma.taxReturn.count({
        where: { userId, status: { in: ["DRAFT", "IN_REVIEW"] } },
      }),
      prisma.ntnRegistration.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
      }),
      prisma.payment.aggregate({
        where: { userId, status: "COMPLETED" },
        _sum: { amount: true },
      }),
      prisma.profile.findFirst({ where: { userId, isPrimary: true } }),
      prisma.activityLog.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    return success(res, {
      totalReturns,
      pendingReturns,
      ntnStatus: ntnCount?.status || null,
      nextDeadline: `${currentYear}-09-30`,
      totalSpent: recentPayments._sum.amount || 0,
      activeProfile,
      recentActivity,
    });
  }),
);

export default router;
