import { prisma } from "../../config/database";

export const gstService = {
  async list(userId: string) {
    return prisma.gstRegistration.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  async getById(id: string) {
    return prisma.gstRegistration.findUnique({ where: { id } });
  },

  async create(userId: string, data: any) {
    return prisma.gstRegistration.create({
      data: {
        userId,
        businessName: data.businessName,
        businessType: data.businessType ?? null,
        ntnNumber: data.ntnNumber ?? null,
        cnic: data.cnic ?? null,
        phone: data.phone ?? null,
        email: data.email ?? null,
        address: data.address ?? null,
        annualTurnover: data.annualTurnover ? Number(data.annualTurnover) : null,
        natureOfBusiness: data.natureOfBusiness ?? null,
        fee: data.fee ? Number(data.fee) : null,
        status: "PENDING",
      },
    });
  },
};
