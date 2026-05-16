import { prisma } from "../../config/database";

export const expenseTrackerService = {
  async list(
    userId: string,
    page: number,
    limit: number,
    filters: Record<string, any>,
  ) {
    const where: any = { userId };
    if (filters.category) where.category = filters.category;
    if (filters.startDate || filters.endDate) {
      where.date = {};
      if (filters.startDate)
        where.date.gte = new Date(filters.startDate as string);
      if (filters.endDate) where.date.lte = new Date(filters.endDate as string);
    }

    const [data, total] = await Promise.all([
      prisma.expense.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { date: "desc" },
      }),
      prisma.expense.count({ where }),
    ]);
    return { data, pagination: { page, limit, total } };
  },

  async getById(id: string) {
    return prisma.expense.findUnique({ where: { id } });
  },

  async create(userId: string, data: any) {
    return prisma.expense.create({
      data: { ...data, userId, date: new Date(data.date) },
    });
  },

  async update(id: string, userId: string, data: any) {
    const existing = await prisma.expense.findFirst({ where: { id, userId } });
    if (!existing)
      throw Object.assign(new Error("Expense not found"), { statusCode: 404 });
    if (data.date) data.date = new Date(data.date);
    return prisma.expense.update({ where: { id }, data });
  },

  async remove(id: string, userId: string) {
    const existing = await prisma.expense.findFirst({ where: { id, userId } });
    if (!existing)
      throw Object.assign(new Error("Expense not found"), { statusCode: 404 });
    return prisma.expense.delete({ where: { id } });
  },
};
