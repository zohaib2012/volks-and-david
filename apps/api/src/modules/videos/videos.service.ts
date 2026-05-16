import { prisma } from "../../config/database";

export const videoService = {
  async list(publicOnly: boolean) {
    const where: any = {};
    if (publicOnly) where.isPublished = true;
    return prisma.video.findMany({ where, orderBy: { createdAt: "desc" } });
  },

  async getById(id: string) {
    return prisma.video.findUnique({ where: { id } });
  },

  async create(data: any) {
    return prisma.video.create({ data });
  },

  async update(id: string, data: any) {
    return prisma.video.update({ where: { id }, data });
  },

  async remove(id: string) {
    return prisma.video.delete({ where: { id } });
  },
};
