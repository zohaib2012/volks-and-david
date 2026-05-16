import { prisma } from "../../config/database";

export const ipService = {
  async list(userId: string) {
    return prisma.ipRegistration.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  async getById(id: string) {
    return prisma.ipRegistration.findUnique({ where: { id } });
  },

  async create(userId: string, data: any) {
    return prisma.ipRegistration.create({
      data: {
        userId,
        type: data.type,
        formData: data.formData ?? null,
        fee: data.fee ? Number(data.fee) : null,
        refNumber: data.refNumber ?? null,
        status: "PENDING",
      },
    });
  },
};
