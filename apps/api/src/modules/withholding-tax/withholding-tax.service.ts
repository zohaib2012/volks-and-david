import { prisma } from "../../config/database";

export const withholdingTaxService = {
  async list(userId: string) {
    return prisma.withholdingTax.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  async getById(id: string) {
    return prisma.withholdingTax.findUnique({ where: { id } });
  },

  async create(userId: string, data: any) {
    return prisma.withholdingTax.create({
      data: {
        userId,
        taxYear: Number(data.taxYear),
        statementType: data.statementType ?? null,
        source: data.source ?? null,
        status: "PENDING",
      },
    });
  },
};
