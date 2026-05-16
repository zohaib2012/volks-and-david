import { prisma } from "../../config/database";

export const paymentService = {
  async list(userId: string) {
    return prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  async getById(id: string) {
    return prisma.payment.findUnique({ where: { id } });
  },
};
