import { prisma } from "../../config/database";

export const psebService = {
  async listCompany(userId: string) {
    return prisma.psebCompanyRegistration.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },
  async getCompanyById(id: string) {
    return prisma.psebCompanyRegistration.findUnique({ where: { id } });
  },
  async createCompany(userId: string, data: any) {
    return prisma.psebCompanyRegistration.create({
      data: {
        userId,
        companyName: data.companyName,
        companyType: data.companyType,
        businessNtn: data.businessNtn ?? null,
        registrationDate: data.registrationDate ? new Date(data.registrationDate) : null,
        servicesOffered: data.servicesOffered ?? null,
        serviceDescription: data.serviceDescription ?? null,
        address: data.address ?? null,
        city: data.city ?? null,
        province: data.province ?? null,
        phone: data.phone ?? null,
        email: data.email ?? null,
        website: data.website ?? null,
        totalEmployees: data.totalEmployees ? Number(data.totalEmployees) : null,
        directors: data.directors ?? null,
        ntnCertificateUrl: data.ntnCertificateUrl ?? null,
        cnicDirectorsUrl: data.cnicDirectorsUrl ?? null,
        moaUrl: data.moaUrl ?? null,
        aoaUrl: data.aoaUrl ?? null,
        form29Url: data.form29Url ?? null,
        form2Url: data.form2Url ?? null,
        incCertificateUrl: data.incCertificateUrl ?? null,
        partnershipDeedUrl: data.partnershipDeedUrl ?? null,
        formCUrl: data.formCUrl ?? null,
        bankStatementUrl: data.bankStatementUrl ?? null,
        fee: data.fee ? Number(data.fee) : null,
        status: "SUBMITTED",
      },
    });
  },
  async updateCompany(id: string, data: any) {
    return prisma.psebCompanyRegistration.update({ where: { id }, data });
  },

  async listCallCenter(userId: string) {
    return prisma.psebCallCenterRegistration.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },
  async getCallCenterById(id: string) {
    return prisma.psebCallCenterRegistration.findUnique({ where: { id } });
  },
  async createCallCenter(userId: string, data: any) {
    return prisma.psebCallCenterRegistration.create({
      data: {
        userId,
        companyName: data.companyName,
        companyType: data.companyType,
        businessNtn: data.businessNtn ?? null,
        registrationDate: data.registrationDate ? new Date(data.registrationDate) : null,
        seatingCapacity: data.seatingCapacity ? Number(data.seatingCapacity) : null,
        numberOfShifts: data.numberOfShifts ? Number(data.numberOfShifts) : null,
        dialerSystem: data.dialerSystem ?? null,
        pbxSystem: data.pbxSystem ?? null,
        internetBandwidth: data.internetBandwidth ?? null,
        serviceType: data.serviceType ?? null,
        clientCountries: data.clientCountries ?? null,
        serviceDescription: data.serviceDescription ?? null,
        address: data.address ?? null,
        city: data.city ?? null,
        province: data.province ?? null,
        floorArea: data.floorArea ?? null,
        phone: data.phone ?? null,
        email: data.email ?? null,
        website: data.website ?? null,
        totalEmployees: data.totalEmployees ? Number(data.totalEmployees) : null,
        directors: data.directors ?? null,
        ntnCertificateUrl: data.ntnCertificateUrl ?? null,
        cnicDirectorsUrl: data.cnicDirectorsUrl ?? null,
        moaUrl: data.moaUrl ?? null,
        aoaUrl: data.aoaUrl ?? null,
        form29Url: data.form29Url ?? null,
        incCertificateUrl: data.incCertificateUrl ?? null,
        partnershipDeedUrl: data.partnershipDeedUrl ?? null,
        formCUrl: data.formCUrl ?? null,
        bankStatementUrl: data.bankStatementUrl ?? null,
        officePhotosUrl: data.officePhotosUrl ?? null,
        equipmentListUrl: data.equipmentListUrl ?? null,
        isBranch: data.isBranch ?? false,
        mainOfficeId: data.mainOfficeId ?? null,
        fee: data.fee ? Number(data.fee) : null,
        status: "SUBMITTED",
      },
    });
  },
  async updateCallCenter(id: string, data: any) {
    return prisma.psebCallCenterRegistration.update({ where: { id }, data });
  },

  async adminListCompany(filters: { status?: string; search?: string }) {
    const where: any = {};
    if (filters.status) where.status = filters.status;
    if (filters.search) {
      where.OR = [
        { companyName: { contains: filters.search, mode: "insensitive" } },
        { businessNtn: { contains: filters.search, mode: "insensitive" } },
      ];
    }
    return prisma.psebCompanyRegistration.findMany({
      where,
      include: { user: { select: { id: true, email: true, name: true, phone: true } } },
      orderBy: { createdAt: "desc" },
    });
  },
  async adminListCallCenter(filters: { status?: string; search?: string }) {
    const where: any = {};
    if (filters.status) where.status = filters.status;
    if (filters.search) {
      where.OR = [
        { companyName: { contains: filters.search, mode: "insensitive" } },
        { businessNtn: { contains: filters.search, mode: "insensitive" } },
      ];
    }
    return prisma.psebCallCenterRegistration.findMany({
      where,
      include: { user: { select: { id: true, email: true, name: true, phone: true } } },
      orderBy: { createdAt: "desc" },
    });
  },
  async adminReviewCompany(id: string, data: { status: string; adminNotes?: string; psebRefNumber?: string; certificateUrl?: string }) {
    return prisma.psebCompanyRegistration.update({
      where: { id },
      data: {
        status: data.status as any,
        adminNotes: data.adminNotes ?? null,
        psebRefNumber: data.psebRefNumber ?? null,
        certificateUrl: data.certificateUrl ?? null,
      },
    });
  },
  async adminReviewCallCenter(id: string, data: { status: string; adminNotes?: string; psebRefNumber?: string; certificateUrl?: string; provisionalLetterUrl?: string; inspectionDate?: string; inspectionNotes?: string }) {
    return prisma.psebCallCenterRegistration.update({
      where: { id },
      data: {
        status: data.status as any,
        adminNotes: data.adminNotes ?? null,
        psebRefNumber: data.psebRefNumber ?? null,
        certificateUrl: data.certificateUrl ?? null,
        provisionalLetterUrl: data.provisionalLetterUrl ?? null,
        inspectionDate: data.inspectionDate ? new Date(data.inspectionDate) : null,
        inspectionNotes: data.inspectionNotes ?? null,
      },
    });
  },
};
