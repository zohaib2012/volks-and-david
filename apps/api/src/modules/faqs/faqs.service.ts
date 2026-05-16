import { prisma } from "../../config/database";

export const faqService = {
  async list(publicOnly: boolean) {
    const where: any = {};
    if (publicOnly) where.isPublished = true;
    return prisma.faq.findMany({ where, orderBy: { order: "asc" } });
  },

  async getById(id: string) {
    return prisma.faq.findUnique({ where: { id } });
  },

  async create(data: any) {
    return prisma.faq.create({ data });
  },

  async update(id: string, data: any) {
    return prisma.faq.update({ where: { id }, data });
  },

  async remove(id: string) {
    return prisma.faq.delete({ where: { id } });
  },
};
