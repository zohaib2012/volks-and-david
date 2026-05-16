import { prisma } from "../../config/database";

export const profileService = {
  async list(userId: string) {
    return prisma.profile.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  async getById(id: string) {
    return prisma.profile.findUnique({ where: { id } });
  },

  async create(userId: string, data: any) {
    if (data.isPrimary) {
      await prisma.profile.updateMany({
        where: { userId },
        data: { isPrimary: false },
      });
    }
    return prisma.profile.create({ data: { ...data, userId } });
  },

  async update(id: string, userId: string, data: any) {
    const existing = await prisma.profile.findFirst({ where: { id, userId } });
    if (!existing)
      throw Object.assign(new Error("Profile not found"), { statusCode: 404 });

    if (data.isPrimary) {
      await prisma.profile.updateMany({
        where: { userId },
        data: { isPrimary: false },
      });
    }
    return prisma.profile.update({ where: { id }, data });
  },

  async remove(id: string, userId: string) {
    const existing = await prisma.profile.findFirst({ where: { id, userId } });
    if (!existing)
      throw Object.assign(new Error("Profile not found"), { statusCode: 404 });
    return prisma.profile.delete({ where: { id } });
  },
};
