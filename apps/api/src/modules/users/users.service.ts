import { prisma } from "../../config/database";

export const userService = {
  async list(page: number, limit: number, filters: Record<string, any>) {
    const where: any = {};
    if (filters.role) where.role = filters.role;
    if (filters.isActive !== undefined)
      where.isActive = filters.isActive === "true";
    if (filters.search) {
      where.OR = [
        { email: { contains: filters.search } },
        { name: { contains: filters.search } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }),
    ]);

    return { data, pagination: { page, limit, total } };
  },

  async getById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        isActive: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        referralCode: true,
        language: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });
  },

  async update(id: string, data: any) {
    const allowed = ["name", "phone", "language", "isActive", "role"];
    const updateData: any = {};
    for (const key of allowed) {
      if (data[key] !== undefined) updateData[key] = data[key];
    }
    return prisma.user.update({ where: { id }, data: updateData });
  },
};
