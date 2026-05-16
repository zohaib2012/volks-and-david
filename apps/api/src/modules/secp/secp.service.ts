import { prisma } from "../../config/database";

export const secpService = {
  async list(userId: string) {
    return prisma.secpRegistration.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  async getById(id: string) {
    return prisma.secpRegistration.findUnique({ where: { id } });
  },

  async create(userId: string, data: any) {
    return prisma.secpRegistration.create({
      data: {
        userId,
        companyType: data.companyType ?? null,
        companyNames: data.companyNames ?? null,
        address: data.address ?? null,
        city: data.city ?? null,
        paidUpCapital: data.paidUpCapital ? Number(data.paidUpCapital) : null,
        natureOfBusiness: data.natureOfBusiness ?? null,
        directors: data.directors ?? null,
        fee: data.fee ? Number(data.fee) : null,
        secpRefNumber: data.secpRefNumber ?? null,
        status: "PENDING",
      },
    });
  },
};
