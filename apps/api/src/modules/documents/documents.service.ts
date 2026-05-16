import { prisma } from "../../config/database";

export const documentService = {
  async list(userId: string) {
    return prisma.document.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  async getById(id: string) {
    return prisma.document.findUnique({ where: { id } });
  },

  async create(userId: string, data: any) {
    return prisma.document.create({
      data: {
        userId,
        name: data.name,
        type: data.type ?? null,
        fileUrl: data.fileUrl ?? null,
        taxYear: data.taxYear ? Number(data.taxYear) : null,
        notes: data.notes ?? null,
        fileSize: data.fileSize ?? (data.size ? Number(data.size) : null),
      },
    });
  },

  async update(id: string, userId: string, data: any) {
    const existing = await prisma.document.findFirst({ where: { id, userId } });
    if (!existing)
      throw Object.assign(new Error("Document not found"), { statusCode: 404 });
    return prisma.document.update({ where: { id }, data });
  },

  async remove(id: string, userId: string) {
    const existing = await prisma.document.findFirst({ where: { id, userId } });
    if (!existing)
      throw Object.assign(new Error("Document not found"), { statusCode: 404 });
    return prisma.document.delete({ where: { id } });
  },
};
