import { TaxReturnStatus, PaymentStatus, NotificationType } from "@prisma/client";
import { prisma } from "../../config/database";
import bcrypt from "bcryptjs";

export const adminService = {
  async adminDashboard() {
    const [
      totalUsers,
      activeUsers,
      totalReturns,
      pendingReviews,
      monthlyRevenue,
      consultants,
      recentReturns,
      chartData,
      totalNtn,
      totalGst,
      totalSecp,
      totalIp,
      totalConsultations,
      totalUsaServices,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.taxReturn.count(),
      prisma.taxReturn.count({
        where: { status: { in: [TaxReturnStatus.DRAFT, TaxReturnStatus.IN_REVIEW] } },
      }),
      prisma.payment.aggregate({
        where: { status: "COMPLETED", createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } },
        _sum: { amount: true },
      }),
      prisma.user.count({ where: { role: "CONSULTANT" } }),
      prisma.taxReturn.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { user: { select: { id: true, email: true, name: true } } },
      }),
      (async () => {
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
        const users = await prisma.user.findMany({
          where: { createdAt: { gte: twelveMonthsAgo } },
          select: { createdAt: true },
          orderBy: { createdAt: "asc" },
        });
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const counts: Record<string, number> = {};
        for (const u of users) {
          const m = monthNames[u.createdAt.getMonth()];
          counts[m] = (counts[m] || 0) + 1;
        }
        return Object.entries(counts).map(([month, count]) => ({ month, count }));
      })(),
      prisma.ntnRegistration.count(),
      prisma.gstRegistration.count(),
      prisma.secpRegistration.count(),
      prisma.ipRegistration.count(),
      prisma.consultation.count(),
      prisma.usaService.count(),
    ]);

    return {
      stats: {
        totalUsers,
        activeUsers,
        pendingReviews,
        monthlyRevenue: monthlyRevenue._sum.amount || 0,
        totalReturns,
        consultants,
        totalNtn,
        totalGst,
        totalSecp,
        totalIp,
        totalConsultations,
        totalUsaServices,
      },
      recentReturns: recentReturns.map((r: any) => ({
        id: r.id,
        user: r.user,
        returnType: r.returnType,
        taxYear: r.taxYear,
        status: r.status,
        createdAt: r.createdAt,
      })),
      chartData,
    };
  },

  async dashboardStats() {
    const [
      totalUsers,
      totalTaxReturns,
      totalPayments,
      totalRevenue,
      pendingReturns,
      recentUsers,
      totalNtn,
      totalGst,
      totalSecp,
      totalIp,
      totalConsultations,
      totalUsaServices,
      pendingPayments,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.taxReturn.count(),
      prisma.payment.count(),
      prisma.payment.aggregate({
        where: { status: "COMPLETED" },
        _sum: { amount: true },
      }),
      prisma.taxReturn.count({
        where: { status: { in: [TaxReturnStatus.DRAFT, TaxReturnStatus.IN_REVIEW] } },
      }),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
      }),
      prisma.ntnRegistration.count(),
      prisma.gstRegistration.count(),
      prisma.secpRegistration.count(),
      prisma.ipRegistration.count(),
      prisma.consultation.count(),
      prisma.usaService.count(),
      prisma.payment.count({ where: { status: "PENDING" } }),
    ]);

    return {
      totalUsers,
      totalTaxReturns,
      totalPayments,
      totalRevenue: totalRevenue._sum.amount || 0,
      pendingReturns,
      pendingPayments,
      recentUsers,
      totalNtn,
      totalGst,
      totalSecp,
      totalIp,
      totalConsultations,
      totalUsaServices,
    };
  },

  async listUsers(page: number, limit: number, filters: Record<string, any>) {
    const where: any = {};
    if (filters.role) where.role = filters.role;
    if (filters.search) {
      where.OR = [
        { email: { contains: filters.search as string } },
        { name: { contains: filters.search as string } },
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

  async updateUser(id: string, data: any) {
    const allowed = [
      "name",
      "email",
      "phone",
      "role",
      "isActive",
      "isEmailVerified",
      "isPhoneVerified",
      "language",
    ];
    const updateData: any = {};
    for (const key of allowed) {
      if (data[key] !== undefined) updateData[key] = data[key];
    }
    return prisma.user.update({ where: { id }, data: updateData });
  },

  async listTaxReturns(
    page: number,
    limit: number,
    filters: Record<string, any>,
  ) {
    const where: any = {};
    if (filters.status) where.status = filters.status;
    if (filters.taxYear) where.taxYear = Number(filters.taxYear);
    if (filters.userId) where.userId = filters.userId;

    const [data, total] = await Promise.all([
      prisma.taxReturn.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, email: true, name: true } },
          consultant: { select: { id: true, name: true } },
        },
      }),
      prisma.taxReturn.count({ where }),
    ]);
    return { data, pagination: { page, limit, total } };
  },

  async updateTaxReturn(id: string, data: any) {
    const allowed = ["status", "consultantNotes", "consultantId", "fbrReference", "income", "totalIncome", "taxableIncome", "taxPayable"];
    const updateData: any = {};
    for (const key of allowed) {
      if (data[key] !== undefined) updateData[key] = data[key];
    }
    if (data.assignedTo !== undefined) updateData.consultantId = data.assignedTo;
    return prisma.taxReturn.update({ where: { id }, data: updateData });
  },

  async listConsultants(
    page: number,
    limit: number,
    filters: Record<string, any>,
  ) {
    const where: any = { role: "CONSULTANT" };
    if (filters.isActive !== undefined)
      where.isActive = filters.isActive === "true";

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

  async updateConsultant(id: string, data: any) {
    const allowed = ["name", "email", "phone", "isActive"];
    const updateData: any = {};
    for (const key of allowed) {
      if (data[key] !== undefined) updateData[key] = data[key];
    }
    return prisma.user.update({ where: { id }, data: updateData });
  },

  async listPayments(
    page: number,
    limit: number,
    filters: Record<string, any>,
  ) {
    const where: any = {};
    if (filters.status) where.status = filters.status;
    if (filters.serviceType) where.serviceType = filters.serviceType;

    const [data, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { id: true, email: true, name: true } } },
      }),
      prisma.payment.count({ where }),
    ]);
    return { data, pagination: { page, limit, total } };
  },

  async updatePayment(id: string, data: any) {
    return prisma.payment.update({ where: { id }, data });
  },

  async listBlog(page: number, limit: number) {
    const [data, total] = await Promise.all([
      prisma.blogPost.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.blogPost.count(),
    ]);
    return { data, pagination: { page, limit, total } };
  },

  async createBlog(data: any) {
    const slug = data.slug || data.title
      ?.toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") + "-" + Date.now();
    data.slug = slug;
    return prisma.blogPost.create({ data });
  },

  async updateBlog(id: string, data: any) {
    return prisma.blogPost.update({ where: { id }, data });
  },

  async deleteBlog(id: string) {
    return prisma.blogPost.delete({ where: { id } });
  },

  async listVideos(page: number, limit: number) {
    const [data, total] = await Promise.all([
      prisma.video.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.video.count(),
    ]);
    return { data, pagination: { page, limit, total } };
  },

  async createVideo(data: any) {
    return prisma.video.create({ data });
  },

  async updateVideo(id: string, data: any) {
    return prisma.video.update({ where: { id }, data });
  },

  async deleteVideo(id: string) {
    return prisma.video.delete({ where: { id } });
  },

  async listFaqs(page: number, limit: number) {
    const [data, total] = await Promise.all([
      prisma.faq.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { order: "asc" },
      }),
      prisma.faq.count(),
    ]);
    return { data, pagination: { page, limit, total } };
  },

  async createFaq(data: any) {
    return prisma.faq.create({ data });
  },

  async updateFaq(id: string, data: any) {
    return prisma.faq.update({ where: { id }, data });
  },

  async deleteFaq(id: string) {
    return prisma.faq.delete({ where: { id } });
  },

  async listNotices(page: number, limit: number, type?: string) {
    const where: any = {};
    if (type) where.type = type;

    const [data, total] = await Promise.all([
      prisma.fbrNotice.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { id: true, email: true, name: true } } },
      }),
      prisma.fbrNotice.count({ where }),
    ]);
    return { data, pagination: { page, limit, total } };
  },

  async updateNotice(id: string, data: any) {
    return prisma.fbrNotice.update({ where: { id }, data });
  },

  async getSettings() {
    const settings = await prisma.siteSetting.findMany();
    const result: Record<string, any> = {};
    for (const s of settings) {
      result[s.key] = s.value;
    }
    return result;
  },

  async updateSettings(data: Record<string, any>) {
    const results: any[] = [];
    for (const [key, value] of Object.entries(data)) {
      const result = await prisma.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
      results.push(result);
    }
    return results;
  },

  async createUser(data: { name: string; email: string; password: string; role: string }) {
    const hashed = await bcrypt.hash(data.password, 12);
    const referralCode = "REF" + Date.now().toString(36).toUpperCase();
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashed,
        role: data.role as any,
        referralCode,
      },
    });
  },

  async deleteUser(id: string) {
    return prisma.user.delete({ where: { id } });
  },

  async createConsultant(data: { name: string; email: string; password: string; specializations: string[] }) {
    const hashed = await bcrypt.hash(data.password, 12);
    const referralCode = "REF" + Date.now().toString(36).toUpperCase();
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashed,
        role: "CONSULTANT",
        referralCode,
      },
    });
  },

  async deleteConsultant(id: string) {
    return prisma.user.delete({ where: { id } });
  },

  async bulkAssignReturns(returnIds: string[], consultantId: string) {
    await prisma.taxReturn.updateMany({
      where: { id: { in: returnIds } },
      data: { consultantId },
    });
    return { count: returnIds.length };
  },

  async reviewReturn(id: string, data: { action: string; notes?: string }) {
    const statusMap: Record<string, TaxReturnStatus> = {
      approve: TaxReturnStatus.ACCEPTED,
      reject: TaxReturnStatus.REJECTED,
      request_info: TaxReturnStatus.REQUIRES_INFO,
      submit: TaxReturnStatus.SUBMITTED,
    };
    const status = statusMap[data.action];
    if (!status) throw new Error(`Invalid action: ${data.action}`);

    const updateData: any = { status };
    if (data.notes) updateData.consultantNotes = data.notes;

    const updated = await prisma.taxReturn.update({ where: { id }, data: updateData });

    const notifMap: Record<string, { title: string; message: string }> = {
      approve: {
        title: "Tax Return Approved",
        message: "Your tax return has been reviewed and approved. You will be contacted shortly.",
      },
      reject: {
        title: "Tax Return Rejected",
        message: `Your tax return has been rejected.${data.notes ? ` Reason: ${data.notes}` : " Please contact support."}`,
      },
      request_info: {
        title: "More Information Required",
        message: `Additional information is needed for your tax return.${data.notes ? ` Details: ${data.notes}` : ""}`,
      },
      submit: {
        title: "Tax Return Submitted",
        message: "Your tax return has been submitted to FBR.",
      },
    };
    const notif = notifMap[data.action];
    if (notif) {
      await prisma.notification.create({
        data: { userId: updated.userId, type: NotificationType.RETURN_STATUS, title: notif.title, message: notif.message },
      });
    }

    return updated;
  },

  async assignNotice(noticeId: string, consultantId: string) {
    return prisma.fbrNotice.update({
      where: { id: noticeId },
      data: { consultantId, status: "ASSIGNED" },
    });
  },

  async refundPayment(id: string, reason: string) {
    return prisma.payment.update({
      where: { id },
      data: { status: PaymentStatus.REFUNDED, refundReason: reason, refundedAt: new Date() },
    });
  },

  // ==================== NTN Registrations ====================
  async listNtn(page: number, limit: number, filters: Record<string, any>) {
    const where: any = {};
    if (filters.status) where.status = filters.status;
    if (filters.userId) where.userId = filters.userId;
    if (filters.search) {
      where.OR = [
        { fullName: { contains: filters.search as string } },
        { cnic: { contains: filters.search as string } },
        { ntnNumber: { contains: filters.search as string } },
      ];
    }
    const [data, total] = await Promise.all([
      prisma.ntnRegistration.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { id: true, email: true, name: true } } },
      }),
      prisma.ntnRegistration.count({ where }),
    ]);
    return { data, pagination: { page, limit, total } };
  },

  async getNtnById(id: string) {
    return prisma.ntnRegistration.findUnique({ where: { id } });
  },

  async updateNtn(id: string, data: any) {
    const allowed = ["status", "ntnNumber", "fee", "documents"];
    const updateData: any = {};
    for (const key of allowed) {
      if (data[key] !== undefined) updateData[key] = data[key];
    }
    if (Object.keys(updateData).length === 0) return prisma.ntnRegistration.findUnique({ where: { id } });
    return prisma.ntnRegistration.update({ where: { id }, data: updateData });
  },

  // ==================== GST Registrations ====================
  async listGst(page: number, limit: number, filters: Record<string, any>) {
    const where: any = {};
    if (filters.status) where.status = filters.status;
    if (filters.userId) where.userId = filters.userId;
    if (filters.search) {
      where.OR = [
        { businessName: { contains: filters.search as string } },
        { ntnNumber: { contains: filters.search as string } },
        { strn: { contains: filters.search as string } },
      ];
    }
    const [data, total] = await Promise.all([
      prisma.gstRegistration.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { id: true, email: true, name: true } } },
      }),
      prisma.gstRegistration.count({ where }),
    ]);
    return { data, pagination: { page, limit, total } };
  },

  async updateGst(id: string, data: any) {
    const allowed = ["status", "strn", "fee", "annualTurnover", "documents"];
    const updateData: any = {};
    for (const key of allowed) {
      if (data[key] !== undefined) updateData[key] = data[key];
    }
    return prisma.gstRegistration.update({ where: { id }, data: updateData });
  },

  // ==================== SECP Registrations ====================
  async listSecp(page: number, limit: number, filters: Record<string, any>) {
    const where: any = {};
    if (filters.status) where.status = filters.status;
    if (filters.userId) where.userId = filters.userId;
    if (filters.companyType) where.companyType = filters.companyType;
    const [data, total] = await Promise.all([
      prisma.secpRegistration.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { id: true, email: true, name: true } } },
      }),
      prisma.secpRegistration.count({ where }),
    ]);
    return { data, pagination: { page, limit, total } };
  },

  async updateSecp(id: string, data: any) {
    const allowed = ["status", "secpRefNumber", "fee"];
    const updateData: any = {};
    for (const key of allowed) {
      if (data[key] !== undefined) updateData[key] = data[key];
    }
    return prisma.secpRegistration.update({ where: { id }, data: updateData });
  },

  // ==================== IP Registrations ====================
  async listIpRegistrations(page: number, limit: number, filters: Record<string, any>) {
    const where: any = {};
    if (filters.status) where.status = filters.status;
    if (filters.type) where.type = filters.type;
    if (filters.userId) where.userId = filters.userId;
    const [data, total] = await Promise.all([
      prisma.ipRegistration.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { id: true, email: true, name: true } } },
      }),
      prisma.ipRegistration.count({ where }),
    ]);
    return { data, pagination: { page, limit, total } };
  },

  async updateIpRegistration(id: string, data: any) {
    const allowed = ["status", "refNumber", "fee"];
    const updateData: any = {};
    for (const key of allowed) {
      if (data[key] !== undefined) updateData[key] = data[key];
    }
    return prisma.ipRegistration.update({ where: { id }, data: updateData });
  },

  // ==================== Consultations ====================
  async listConsultations(page: number, limit: number, filters: Record<string, any>) {
    const where: any = {};
    if (filters.status) where.status = filters.status;
    if (filters.type) where.type = filters.type;
    if (filters.userId) where.userId = filters.userId;
    if (filters.consultantId) where.consultantId = filters.consultantId;
    const [data, total] = await Promise.all([
      prisma.consultation.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, email: true, name: true } },
          consultant: { select: { id: true, name: true } },
        },
      }),
      prisma.consultation.count({ where }),
    ]);
    return { data, pagination: { page, limit, total } };
  },

  async updateConsultation(id: string, data: any) {
    const allowed = ["status", "consultantId", "fee", "rating", "review", "meetingLink"];
    const updateData: any = {};
    for (const key of allowed) {
      if (data[key] !== undefined) updateData[key] = data[key];
    }
    return prisma.consultation.update({ where: { id }, data: updateData });
  },

  // ==================== Sales Tax Returns ====================
  async listSalesTaxReturns(page: number, limit: number, filters: Record<string, any>) {
    const where: any = {};
    if (filters.status) where.status = filters.status;
    if (filters.userId) where.userId = filters.userId;
    if (filters.periodYear) where.periodYear = Number(filters.periodYear);
    const [data, total] = await Promise.all([
      prisma.salesTaxReturn.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { id: true, email: true, name: true } } },
      }),
      prisma.salesTaxReturn.count({ where }),
    ]);
    return { data, pagination: { page, limit, total } };
  },

  async updateSalesTaxReturn(id: string, data: any) {
    const allowed = ["status", "acknowledgementNo", "totalSales", "taxPayable"];
    const updateData: any = {};
    for (const key of allowed) {
      if (data[key] !== undefined) updateData[key] = data[key];
    }
    return prisma.salesTaxReturn.update({ where: { id }, data: updateData });
  },

  // ==================== Sales Tax Notices ====================
  async listSalesTaxNotices(page: number, limit: number, filters: Record<string, any>) {
    const where: any = {};
    if (filters.status) where.status = filters.status;
    if (filters.userId) where.userId = filters.userId;
    if (filters.search) {
      where.OR = [
        { noticeNumber: { contains: filters.search as string } },
      ];
    }
    const [data, total] = await Promise.all([
      prisma.salesTaxNotice.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { id: true, email: true, name: true } } },
      }),
      prisma.salesTaxNotice.count({ where }),
    ]);
    return { data, pagination: { page, limit, total } };
  },

  async updateSalesTaxNotice(id: string, data: any) {
    const allowed = ["status", "response", "consultantId", "amount", "dueDate"];
    const updateData: any = {};
    for (const key of allowed) {
      if (data[key] !== undefined) updateData[key] = data[key];
    }
    return prisma.salesTaxNotice.update({ where: { id }, data: updateData });
  },

  // ==================== Withholding Tax ====================
  async listWithholdingTax(page: number, limit: number, filters: Record<string, any>) {
    const where: any = {};
    if (filters.status) where.status = filters.status;
    if (filters.userId) where.userId = filters.userId;
    if (filters.taxYear) where.taxYear = Number(filters.taxYear);
    const [data, total] = await Promise.all([
      prisma.withholdingTax.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { id: true, email: true, name: true } } },
      }),
      prisma.withholdingTax.count({ where }),
    ]);
    return { data, pagination: { page, limit, total } };
  },

  async updateWithholdingTax(id: string, data: any) {
    const allowed = ["status", "certificate"];
    const updateData: any = {};
    for (const key of allowed) {
      if (data[key] !== undefined) updateData[key] = data[key];
    }
    return prisma.withholdingTax.update({ where: { id }, data: updateData });
  },

  // ==================== USA Services ====================
  async listUsaServices(page: number, limit: number, filters: Record<string, any>) {
    const where: any = {};
    if (filters.status) where.status = filters.status;
    if (filters.serviceType) where.serviceType = filters.serviceType;
    if (filters.userId) where.userId = filters.userId;
    const [data, total] = await Promise.all([
      prisma.usaService.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { id: true, email: true, name: true } } },
      }),
      prisma.usaService.count({ where }),
    ]);
    return { data, pagination: { page, limit, total } };
  },

  async updateUsaService(id: string, data: any) {
    const allowed = ["status", "ein", "itin", "llcNumber", "bankAccount", "notes", "fee"];
    const updateData: any = {};
    for (const key of allowed) {
      if (data[key] !== undefined) updateData[key] = data[key];
    }
    return prisma.usaService.update({ where: { id }, data: updateData });
  },

  // ==================== Referrals ====================
  async listReferrals(page: number, limit: number, filters: Record<string, any>) {
    const where: any = {};
    if (filters.status) where.status = filters.status;
    if (filters.referrerId) where.referrerId = filters.referrerId;
    const [data, total] = await Promise.all([
      prisma.referral.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { referrer: { select: { id: true, email: true, name: true } } },
      }),
      prisma.referral.count({ where }),
    ]);
    return { data, pagination: { page, limit, total } };
  },

  async updateReferral(id: string, data: any) {
    const allowed = ["status", "reward"];
    const updateData: any = {};
    for (const key of allowed) {
      if (data[key] !== undefined) updateData[key] = data[key];
    }
    return prisma.referral.update({ where: { id }, data: updateData });
  },

  // ==================== Activity Logs ====================
  async listActivityLogs(page: number, limit: number, filters: Record<string, any>) {
    const where: any = {};
    if (filters.type) where.type = filters.type;
    if (filters.userId) where.userId = filters.userId;
    const [data, total] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { id: true, email: true, name: true } } },
      }),
      prisma.activityLog.count({ where }),
    ]);
    return { data, pagination: { page, limit, total } };
  },

  // ==================== Documents ====================
  async listDocuments(page: number, limit: number, filters: Record<string, any>) {
    const where: any = {};
    if (filters.type) where.type = filters.type;
    if (filters.userId) where.userId = filters.userId;
    const [data, total] = await Promise.all([
      prisma.document.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { id: true, email: true, name: true } } },
      }),
      prisma.document.count({ where }),
    ]);
    return { data, pagination: { page, limit, total } };
  },

  // ==================== Expenses ====================
  async listExpenses(page: number, limit: number, filters: Record<string, any>) {
    const where: any = {};
    if (filters.category) where.category = filters.category;
    if (filters.userId) where.userId = filters.userId;
    const [data, total] = await Promise.all([
      prisma.expense.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { id: true, email: true, name: true } } },
      }),
      prisma.expense.count({ where }),
    ]);
    return { data, pagination: { page, limit, total } };
  },

  // ==================== Profiles ====================
  async listProfiles(page: number, limit: number, filters: Record<string, any>) {
    const where: any = {};
    if (filters.userId) where.userId = filters.userId;
    if (filters.city) where.city = filters.city;
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search as string } },
        { cnic: { contains: filters.search as string } },
        { phone: { contains: filters.search as string } },
      ];
    }
    const [data, total] = await Promise.all([
      prisma.profile.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { id: true, email: true, name: true } } },
      }),
      prisma.profile.count({ where }),
    ]);
    return { data, pagination: { page, limit, total } };
  },

  // ==================== Notifications ====================
  async sendNotification(data: { recipient: string; userId?: string; type: string; title: string; message?: string }) {
    const notificationType = data.type as NotificationType;

    if (data.recipient === "ALL") {
      const users = await prisma.user.findMany({ select: { id: true } });
      await prisma.notification.createMany({
        data: users.map((u) => ({
          userId: u.id,
          type: notificationType,
          title: data.title,
          message: data.message || null,
        })),
      });
      return { count: users.length };
    }

    if (!data.userId) throw new Error("userId is required for specific recipient");
    const user = await prisma.user.findUnique({ where: { id: data.userId } });
    if (!user) throw new Error("User not found");

    await prisma.notification.create({
      data: {
        userId: data.userId,
        type: notificationType,
        title: data.title,
        message: data.message || null,
      },
    });
    return { count: 1 };
  },

  async listSentNotifications(page: number, limit: number) {
    const [data, total] = await Promise.all([
      prisma.notification.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { id: true, name: true, email: true } } },
      }),
      prisma.notification.count(),
    ]);
    return { data, pagination: { page, limit, total } };
  },

  // ==================== Revenue Data ====================
  async revenueData() {
    const now = new Date();
    const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    const payments = await prisma.payment.findMany({
      where: {
        status: "COMPLETED",
        createdAt: { gte: twelveMonthsAgo },
      },
      select: { amount: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    });

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyData: Record<string, number> = {};

    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = monthNames[d.getMonth()] + " " + d.getFullYear();
      monthlyData[key] = 0;
    }

    for (const p of payments) {
      const key = monthNames[p.createdAt.getMonth()] + " " + p.createdAt.getFullYear();
      if (monthlyData[key] !== undefined) {
        monthlyData[key] += p.amount;
      }
    }

    const revenueChart = Object.entries(monthlyData).map(([month, revenue]) => ({
      month,
      revenue,
    }));

    const totalRevenue = revenueChart.reduce((sum, r) => sum + r.revenue, 0);
    const currentMonthRevenue = revenueChart[revenueChart.length - 1]?.revenue || 0;
    const prevMonthRevenue = revenueChart[revenueChart.length - 2]?.revenue || 0;
    const growthPercent = prevMonthRevenue > 0
      ? Math.round(((currentMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100)
      : 0;

    return { revenueChart, totalRevenue, growthPercent };
  },
};
