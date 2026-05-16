import { prisma } from "../../config/database";

export const salesTaxNoticeService = {
  async list(userId: string) {
    return prisma.salesTaxNotice.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  async getById(id: string) {
    return prisma.salesTaxNotice.findUnique({ where: { id } });
  },

  async create(userId: string, data: any) {
    return prisma.salesTaxNotice.create({
      data: {
        userId,
        noticeNumber: data.noticeNumber,
        type: data.type,
        period: data.period ?? null,
        amount: data.amount ? Number(data.amount) : null,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        document: data.document ?? null,
        status: "PENDING",
      },
    });
  },

  async respond(id: string, userId: string, response: string) {
    const existing = await prisma.salesTaxNotice.findFirst({
      where: { id, userId },
    });
    if (!existing)
      throw Object.assign(new Error("Notice not found"), { statusCode: 404 });
    return prisma.salesTaxNotice.update({
      where: { id },
      data: { response, status: "RESPONDED" },
    });
  },
};
