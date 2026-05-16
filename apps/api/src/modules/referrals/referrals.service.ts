import { prisma } from "../../config/database";

export const referralService = {
  async stats(userId: string) {
    const [total, pending, completed] = await Promise.all([
      prisma.referral.count({ where: { referrerId: userId } }),
      prisma.referral.count({
        where: { referrerId: userId, status: "PENDING" },
      }),
      prisma.referral.count({
        where: { referrerId: userId, status: "COMPLETED" },
      }),
    ]);
    const rewards = await prisma.referral.aggregate({
      where: { referrerId: userId, status: "COMPLETED" },
      _sum: { reward: true },
    });
    return { total, pending, completed, totalReward: rewards._sum.reward || 0 };
  },

  async list(userId: string) {
    return prisma.referral.findMany({
      where: { referrerId: userId },
      orderBy: { createdAt: "desc" },
    });
  },
};
