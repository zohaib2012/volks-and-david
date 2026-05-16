import { prisma } from "../../config/database";

export const settingsService = {
  async getSettings(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { language: true, themeSettings: true },
    });
    return user || { language: "en", themeSettings: null };
  },

  async updateTheme(userId: string, themeSettings: any) {
    return prisma.user.update({
      where: { id: userId },
      data: { themeSettings },
      select: { themeSettings: true },
    });
  },
};
