import { prisma } from "../../config/database";

export const taxReturnService = {
  async list(
    userId: string,
    page: number,
    limit: number,
    filters: Record<string, any>,
  ) {
    const where: any = { userId };
    if (filters.taxYear) where.taxYear = Number(filters.taxYear);
    if (filters.status) where.status = filters.status;
    if (filters.returnType) where.returnType = filters.returnType;
    if (filters.profileId) where.profileId = filters.profileId;

    const [data, total] = await Promise.all([
      prisma.taxReturn.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.taxReturn.count({ where }),
    ]);

    return { data, pagination: { page, limit, total } };
  },

  async getById(id: string) {
    return prisma.taxReturn.findUnique({ where: { id } });
  },

  async create(userId: string, data: any) {
    const {
      taxYear, profileId,
      incomeData, deductionData, assetData, liabilityData,
      income, deductions, assets, liabilities,
      totalIncome, totalDeductions, taxableIncome, taxPayable,
      returnType, status,
      hasNtn, fbrPassword, fbrPin, cnicFrontUrl, cnicBackUrl,
    } = data;

    const validProfileId =
      profileId && profileId !== "self" && profileId !== "spouse" && profileId !== ""
        ? profileId
        : null;

    return prisma.taxReturn.create({
      data: {
        userId,
        taxYear: Number(taxYear),
        profileId: validProfileId,
        returnType: returnType || "SALARIED",
        status: status || "DRAFT",
        income: income ?? incomeData ?? {},
        deductions: deductions ?? deductionData ?? {},
        assets: assets ?? assetData ?? {},
        liabilities: liabilities ?? liabilityData ?? {},
        totalIncome: totalIncome ? Number(totalIncome) : 0,
        totalDeductions: totalDeductions ? Number(totalDeductions) : 0,
        taxableIncome: taxableIncome ? Number(taxableIncome) : 0,
        taxPayable: taxPayable ? Number(taxPayable) : 0,
        hasNtn: hasNtn ?? null,
        fbrPassword: fbrPassword || null,
        fbrPin: fbrPin || null,
        cnicFrontUrl: cnicFrontUrl || null,
        cnicBackUrl: cnicBackUrl || null,
      },
    });
  },

  async update(id: string, userId: string, data: any) {
    const existing = await prisma.taxReturn.findFirst({ where: { id, userId } });
    if (!existing)
      throw Object.assign(new Error("Tax return not found"), { statusCode: 404 });
    const updateData = { ...data };
    if (updateData.taxYear) updateData.taxYear = Number(updateData.taxYear);
    if (updateData.profileId === "self" || updateData.profileId === "spouse" || updateData.profileId === "")
      updateData.profileId = null;
    return prisma.taxReturn.update({ where: { id }, data: updateData });
  },

  async remove(id: string, userId: string) {
    const existing = await prisma.taxReturn.findFirst({
      where: { id, userId },
    });
    if (!existing)
      throw Object.assign(new Error("Tax return not found"), {
        statusCode: 404,
      });
    return prisma.taxReturn.delete({ where: { id } });
  },
};
