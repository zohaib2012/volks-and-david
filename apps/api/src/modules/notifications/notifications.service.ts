import { NotificationType } from "@prisma/client";
import { prisma } from "../../config/database";

const TYPE_MAP: Record<string, NotificationType> = {
  tax_deadline: NotificationType.TAX_DEADLINE,
  return_status: NotificationType.RETURN_STATUS,
  payment: NotificationType.PAYMENT,
  consultation: NotificationType.CONSULTATION,
  system: NotificationType.SYSTEM,
  referral: NotificationType.REFERRAL,
  fbr_notice: NotificationType.FBR_NOTICE,
};

export const notificationService = {
  async create(userId: string, type: NotificationType, title: string, message?: string) {
    return prisma.notification.create({
      data: { userId, type, title, message: message ?? null },
    });
  },

  async list(userId: string, filters: { type?: string; unread?: string }) {
    const where: any = { userId };
    if (filters.type) {
      const dbType = TYPE_MAP[filters.type] ?? (filters.type.toUpperCase() as NotificationType);
      where.type = dbType;
    }
    if (filters.unread === "true") where.isRead = false;
    return prisma.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  },

  async getUnreadCount(userId: string) {
    return prisma.notification.count({ where: { userId, isRead: false } });
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

  async getPreferences(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { notificationPreferences: true },
    });
    return user?.notificationPreferences ?? null;
  },

  async savePreferences(userId: string, preferences: any) {
    await prisma.user.update({
      where: { id: userId },
      data: { notificationPreferences: preferences },
    });
    return preferences;
  },
};
