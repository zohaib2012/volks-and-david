import { prisma } from "../../config/database";

export const ntnService = {
  async list(userId: string) {
    return prisma.ntnRegistration.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  async getById(id: string) {
    return prisma.ntnRegistration.findUnique({ where: { id } });
  },

  async create(userId: string, data: any) {
    return prisma.ntnRegistration.create({
      data: {
        userId,
        ntnType: data.ntnType,
        cnic: data.cnic,
        fullName: data.fullName,
        fatherName: data.fatherName ?? null,
        dob: data.dob ? new Date(data.dob) : null,
        address: data.address ?? null,
        city: data.city ?? null,
        province: data.province ?? null,
        phone: data.phone ?? null,
        email: data.email ?? null,
        fee: data.fee ? Number(data.fee) : null,
        documents: data.documents ?? null,
      },
    });
  },
};
