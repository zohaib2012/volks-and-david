import { prisma } from "../../config/database";

export const fbrProfileService = {
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, phone: true },
    });
    const profile = await prisma.profile.findFirst({
      where: { userId, isPrimary: true },
    });
    return { user, profile };
  },

  async updateProfile(userId: string, data: any) {
    const profileData = {
      name: data.name ?? undefined,
      cnic: data.cnic ?? undefined,
      dob: data.dob ? new Date(data.dob) : undefined,
      fatherName: data.fatherName ?? undefined,
      address: data.address ?? undefined,
      city: data.city ?? undefined,
      province: data.province ?? undefined,
      phone: data.phone ?? undefined,
      email: data.email ?? undefined,
      employer: data.employer ?? undefined,
      gender: data.gender ?? undefined,
      designation: data.designation ?? undefined,
      salary: data.salary ? Number(data.salary) : undefined,
      bankName: data.bankName ?? data.bank ?? undefined,
      iban: data.iban ?? undefined,
    };

    const primary = await prisma.profile.findFirst({
      where: { userId, isPrimary: true },
    });

    if (primary) {
      return prisma.profile.update({ where: { id: primary.id }, data: profileData });
    }

    return prisma.profile.create({
      data: {
        ...profileData,
        name: data.name || "My Profile",
        userId,
        isPrimary: true,
      },
    });
  },
};
