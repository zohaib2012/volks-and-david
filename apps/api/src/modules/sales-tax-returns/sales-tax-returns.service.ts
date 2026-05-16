import { prisma } from "../../config/database";

export const salesTaxReturnService = {
  async list(
    userId: string,
    page: number,
    limit: number,
    filters: Record<string, any>,
  ) {
    const where: any = { userId };
    if (filters.periodYear) where.periodYear = Number(filters.periodYear);
    if (filters.periodMonth) where.periodMonth = Number(filters.periodMonth);
    if (filters.status) where.status = filters.status;

    const [data, total] = await Promise.all([
      prisma.salesTaxReturn.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.salesTaxReturn.count({ where }),
    ]);
    return { data, pagination: { page, limit, total } };
  },

  async getById(id: string) {
    return prisma.salesTaxReturn.findUnique({ where: { id } });
  },

  async create(userId: string, data: any) {
    return prisma.salesTaxReturn.create({ data: { ...data, userId } });
  },
};
