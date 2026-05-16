import { prisma } from "../../config/database";

export const fbrNoticeService = {
  async list(userId: string) {
    return prisma.fbrNotice.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  async getById(id: string) {
    return prisma.fbrNotice.findUnique({ where: { id } });
  },

  async create(userId: string, data: any) {
    return prisma.fbrNotice.create({
      data: {
        userId,
        noticeNumber: data.noticeNumber,
        type: data.type,
        taxYear: data.taxYear ? Number(data.taxYear) : null,
        issueDate: data.issueDate ? new Date(data.issueDate) : null,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        amount: data.amount ? Number(data.amount) : null,
        urgency: data.urgency || "medium",
        description: data.description ?? null,
        status: "PENDING",
      },
    });
  },

  async respond(id: string, userId: string, response: string) {
    const existing = await prisma.fbrNotice.findFirst({ where: { id, userId } });
    if (!existing)
      throw Object.assign(new Error("Notice not found"), { statusCode: 404 });
    return prisma.fbrNotice.update({
      where: { id },
      data: { response, status: "RESPONDED" },
    });
  },
};
