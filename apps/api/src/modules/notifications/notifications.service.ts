import { prisma } from "../../config/database";

export const notificationService = {
  async list(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  async markRead(id: string, userId: string) {
    return prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });
  },

  async markAllRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  },

  async remove(id: string, userId: string) {
    return prisma.notification.deleteMany({ where: { id, userId } });
  },
};
