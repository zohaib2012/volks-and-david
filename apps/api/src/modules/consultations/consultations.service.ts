import { prisma } from "../../config/database";

export const consultationService = {
  async list(userId: string) {
    return prisma.consultation.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  async getById(id: string) {
    return prisma.consultation.findUnique({ where: { id } });
  },

  async create(userId: string, data: any) {
    return prisma.consultation.create({
      data: {
        ...data,
        userId,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
      },
    });
  },
};
