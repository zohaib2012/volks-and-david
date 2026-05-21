import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { success, paginated } from "../../utils/response";
import { adminService } from "./admin.service";

export const dashboardStats = asyncHandler(
  async (req: Request, res: Response) => {
    const stats = await adminService.dashboardStats();
    return success(res, stats);
  },
);

export const adminDashboard = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await adminService.adminDashboard();
    return success(res, data);
  },
);

export const listUsers = asyncHandler(async (req: Request, res: Response) => {
  const { page = "1", limit = "10", ...filters } = req.query;
  const result = await adminService.listUsers(
    Number(page),
    Number(limit),
    filters,
  );
  return paginated(res, result.data, result.pagination);
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await adminService.updateUser(req.params.id, req.body);
  return success(res, user, "User updated");
});

export const listTaxReturns = asyncHandler(
  async (req: Request, res: Response) => {
    const { page = "1", limit = "10", ...filters } = req.query;
    const result = await adminService.listTaxReturns(
      Number(page),
      Number(limit),
      filters,
    );
    return paginated(res, result.data, result.pagination);
  },
);

export const updateTaxReturn = asyncHandler(
  async (req: Request, res: Response) => {
    const tr = await adminService.updateTaxReturn(req.params.id, req.body);
    return success(res, tr, "Tax return updated");
  },
);

export const listConsultants = asyncHandler(
  async (req: Request, res: Response) => {
    const { page = "1", limit = "10", ...filters } = req.query;
    const result = await adminService.listConsultants(
      Number(page),
      Number(limit),
      filters,
    );
    return paginated(res, result.data, result.pagination);
  },
);

export const updateConsultant = asyncHandler(
  async (req: Request, res: Response) => {
    const consultant = await adminService.updateConsultant(
      req.params.id,
      req.body,
    );
    return success(res, consultant, "Consultant updated");
  },
);

export const listPayments = asyncHandler(
  async (req: Request, res: Response) => {
    const { page = "1", limit = "10", ...filters } = req.query;
    const result = await adminService.listPayments(
      Number(page),
      Number(limit),
      filters,
    );
    return paginated(res, result.data, result.pagination);
  },
);

export const updatePayment = asyncHandler(
  async (req: Request, res: Response) => {
    const payment = await adminService.updatePayment(req.params.id, req.body);
    return success(res, payment, "Payment updated");
  },
);

export const listBlog = asyncHandler(async (req: Request, res: Response) => {
  const { page = "1", limit = "10" } = req.query;
  const result = await adminService.listBlog(Number(page), Number(limit));
  return paginated(res, result.data, result.pagination);
});

export const createBlog = asyncHandler(async (req: Request, res: Response) => {
  const post = await adminService.createBlog({
    ...req.body,
    authorId: req.user!.userId,
  });
  return success(res, post, "Blog post created", 201);
});

export const updateBlog = asyncHandler(async (req: Request, res: Response) => {
  const post = await adminService.updateBlog(req.params.id, req.body);
  return success(res, post, "Blog post updated");
});

export const deleteBlog = asyncHandler(async (req: Request, res: Response) => {
  await adminService.deleteBlog(req.params.id);
  return success(res, null, "Blog post deleted");
});

export const listVideos = asyncHandler(async (req: Request, res: Response) => {
  const { page = "1", limit = "10" } = req.query;
  const result = await adminService.listVideos(Number(page), Number(limit));
  return paginated(res, result.data, result.pagination);
});

export const createVideo = asyncHandler(async (req: Request, res: Response) => {
  const video = await adminService.createVideo(req.body);
  return success(res, video, "Video created", 201);
});

export const updateVideo = asyncHandler(async (req: Request, res: Response) => {
  const video = await adminService.updateVideo(req.params.id, req.body);
  return success(res, video, "Video updated");
});

export const deleteVideo = asyncHandler(async (req: Request, res: Response) => {
  await adminService.deleteVideo(req.params.id);
  return success(res, null, "Video deleted");
});

export const listFaqs = asyncHandler(async (req: Request, res: Response) => {
  const { page = "1", limit = "10" } = req.query;
  const result = await adminService.listFaqs(Number(page), Number(limit));
  return paginated(res, result.data, result.pagination);
});

export const createFaq = asyncHandler(async (req: Request, res: Response) => {
  const faq = await adminService.createFaq(req.body);
  return success(res, faq, "FAQ created", 201);
});

export const updateFaq = asyncHandler(async (req: Request, res: Response) => {
  const faq = await adminService.updateFaq(req.params.id, req.body);
  return success(res, faq, "FAQ updated");
});

export const deleteFaq = asyncHandler(async (req: Request, res: Response) => {
  await adminService.deleteFaq(req.params.id);
  return success(res, null, "FAQ deleted");
});

export const listNotices = asyncHandler(async (req: Request, res: Response) => {
  const { page = "1", limit = "10", type } = req.query;
  const result = await adminService.listNotices(
    Number(page),
    Number(limit),
    type as string,
  );
  return paginated(res, result.data, result.pagination);
});

export const updateNotice = asyncHandler(
  async (req: Request, res: Response) => {
    const notice = await adminService.updateNotice(req.params.id, req.body);
    return success(res, notice, "Notice updated");
  },
);

export const getSettings = asyncHandler(async (req: Request, res: Response) => {
  const settings = await adminService.getSettings();
  return success(res, settings);
});

export const updateSettings = asyncHandler(
  async (req: Request, res: Response) => {
    const settings = await adminService.updateSettings(req.body);
    return success(res, settings, "Settings updated");
  },
);

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await adminService.createUser(req.body);
  return success(res, user, "User created", 201);
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  await adminService.deleteUser(req.params.id);
  return success(res, null, "User deleted");
});

export const createConsultant = asyncHandler(
  async (req: Request, res: Response) => {
    const consultant = await adminService.createConsultant(req.body);
    return success(res, consultant, "Consultant created", 201);
  },
);

export const deleteConsultant = asyncHandler(
  async (req: Request, res: Response) => {
    await adminService.deleteConsultant(req.params.id);
    return success(res, null, "Consultant deleted");
  },
);

export const bulkAssignReturns = asyncHandler(
  async (req: Request, res: Response) => {
    const { returnIds, consultantId } = req.body;
    const result = await adminService.bulkAssignReturns(returnIds, consultantId);
    return success(res, result, "Returns assigned");
  },
);

export const reviewReturn = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await adminService.reviewReturn(req.params.id, req.body);
    return success(res, result, "Return reviewed");
  },
);

export const assignNotice = asyncHandler(
  async (req: Request, res: Response) => {
    const { consultantId } = req.body;
    const notice = await adminService.assignNotice(req.params.id, consultantId);
    return success(res, notice, "Notice assigned");
  },
);

export const refundPayment = asyncHandler(
  async (req: Request, res: Response) => {
    const { reason } = req.body;
    const payment = await adminService.refundPayment(req.params.id, reason);
    return success(res, payment, "Payment refunded");
  },
);

// ==================== NTN ====================
export const listNtn = asyncHandler(async (req: Request, res: Response) => {
  const { page = "1", limit = "10", ...filters } = req.query;
  const result = await adminService.listNtn(Number(page), Number(limit), filters);
  return paginated(res, result.data, result.pagination);
});

export const updateNtn = asyncHandler(async (req: Request, res: Response) => {
  const ntn = await adminService.updateNtn(req.params.id, req.body);
  return success(res, ntn, "NTN registration updated");
});

export const uploadNtnDoc = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });
  const filename = req.file.filename;
  const url = `/uploads/${filename}`;
  const ntn = await adminService.updateNtn(req.params.id, {
    adminDocUrl: url,
    adminDocName: req.file.originalname,
  });
  return success(res, { url, name: req.file.originalname }, "Document uploaded");
});

export const uploadReturnDoc = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });
  const filename = req.file.filename;
  const url = `/uploads/${filename}`;
  const tr = await adminService.updateTaxReturn(req.params.id, {
    adminDocUrl: url,
    adminDocName: req.file.originalname,
  });
  return success(res, { url, name: req.file.originalname }, "Document uploaded");
});

// ==================== GST ====================
export const listGst = asyncHandler(async (req: Request, res: Response) => {
  const { page = "1", limit = "10", ...filters } = req.query;
  const result = await adminService.listGst(Number(page), Number(limit), filters);
  return paginated(res, result.data, result.pagination);
});

export const updateGst = asyncHandler(async (req: Request, res: Response) => {
  const gst = await adminService.updateGst(req.params.id, req.body);
  return success(res, gst, "GST registration updated");
});

// ==================== SECP ====================
export const listSecp = asyncHandler(async (req: Request, res: Response) => {
  const { page = "1", limit = "10", ...filters } = req.query;
  const result = await adminService.listSecp(Number(page), Number(limit), filters);
  return paginated(res, result.data, result.pagination);
});

export const updateSecp = asyncHandler(async (req: Request, res: Response) => {
  const secp = await adminService.updateSecp(req.params.id, req.body);
  return success(res, secp, "SECP registration updated");
});

// ==================== IP Registrations ====================
export const listIpRegistrations = asyncHandler(async (req: Request, res: Response) => {
  const { page = "1", limit = "10", ...filters } = req.query;
  const result = await adminService.listIpRegistrations(Number(page), Number(limit), filters);
  return paginated(res, result.data, result.pagination);
});

export const updateIpRegistration = asyncHandler(async (req: Request, res: Response) => {
  const ip = await adminService.updateIpRegistration(req.params.id, req.body);
  return success(res, ip, "IP registration updated");
});

// ==================== Consultations ====================
export const listConsultations = asyncHandler(async (req: Request, res: Response) => {
  const { page = "1", limit = "10", ...filters } = req.query;
  const result = await adminService.listConsultations(Number(page), Number(limit), filters);
  return paginated(res, result.data, result.pagination);
});

export const updateConsultation = asyncHandler(async (req: Request, res: Response) => {
  const consultation = await adminService.updateConsultation(req.params.id, req.body);
  return success(res, consultation, "Consultation updated");
});

// ==================== Sales Tax Returns ====================
export const listSalesTaxReturns = asyncHandler(async (req: Request, res: Response) => {
  const { page = "1", limit = "10", ...filters } = req.query;
  const result = await adminService.listSalesTaxReturns(Number(page), Number(limit), filters);
  return paginated(res, result.data, result.pagination);
});

export const updateSalesTaxReturn = asyncHandler(async (req: Request, res: Response) => {
  const sr = await adminService.updateSalesTaxReturn(req.params.id, req.body);
  return success(res, sr, "Sales tax return updated");
});

// ==================== Sales Tax Notices ====================
export const listSalesTaxNotices = asyncHandler(async (req: Request, res: Response) => {
  const { page = "1", limit = "10", ...filters } = req.query;
  const result = await adminService.listSalesTaxNotices(Number(page), Number(limit), filters);
  return paginated(res, result.data, result.pagination);
});

export const updateSalesTaxNotice = asyncHandler(async (req: Request, res: Response) => {
  const notice = await adminService.updateSalesTaxNotice(req.params.id, req.body);
  return success(res, notice, "Sales tax notice updated");
});

// ==================== Withholding Tax ====================
export const listWithholdingTax = asyncHandler(async (req: Request, res: Response) => {
  const { page = "1", limit = "10", ...filters } = req.query;
  const result = await adminService.listWithholdingTax(Number(page), Number(limit), filters);
  return paginated(res, result.data, result.pagination);
});

export const updateWithholdingTax = asyncHandler(async (req: Request, res: Response) => {
  const wt = await adminService.updateWithholdingTax(req.params.id, req.body);
  return success(res, wt, "Withholding tax updated");
});

// ==================== USA Services ====================
export const listUsaServices = asyncHandler(async (req: Request, res: Response) => {
  const { page = "1", limit = "10", ...filters } = req.query;
  const result = await adminService.listUsaServices(Number(page), Number(limit), filters);
  return paginated(res, result.data, result.pagination);
});

export const updateUsaService = asyncHandler(async (req: Request, res: Response) => {
  const usa = await adminService.updateUsaService(req.params.id, req.body);
  return success(res, usa, "USA service updated");
});

// ==================== Referrals ====================
export const listReferrals = asyncHandler(async (req: Request, res: Response) => {
  const { page = "1", limit = "10", ...filters } = req.query;
  const result = await adminService.listReferrals(Number(page), Number(limit), filters);
  return paginated(res, result.data, result.pagination);
});

export const updateReferral = asyncHandler(async (req: Request, res: Response) => {
  const referral = await adminService.updateReferral(req.params.id, req.body);
  return success(res, referral, "Referral updated");
});

// ==================== Activity Logs ====================
export const listActivityLogs = asyncHandler(async (req: Request, res: Response) => {
  const { page = "1", limit = "10", ...filters } = req.query;
  const result = await adminService.listActivityLogs(Number(page), Number(limit), filters);
  return paginated(res, result.data, result.pagination);
});

// ==================== Documents ====================
export const listDocuments = asyncHandler(async (req: Request, res: Response) => {
  const { page = "1", limit = "10", ...filters } = req.query;
  const result = await adminService.listDocuments(Number(page), Number(limit), filters);
  return paginated(res, result.data, result.pagination);
});

// ==================== Expenses ====================
export const listExpenses = asyncHandler(async (req: Request, res: Response) => {
  const { page = "1", limit = "10", ...filters } = req.query;
  const result = await adminService.listExpenses(Number(page), Number(limit), filters);
  return paginated(res, result.data, result.pagination);
});

// ==================== Profiles ====================
export const listProfiles = asyncHandler(async (req: Request, res: Response) => {
  const { page = "1", limit = "10", ...filters } = req.query;
  const result = await adminService.listProfiles(Number(page), Number(limit), filters);
  return paginated(res, result.data, result.pagination);
});

// ==================== Notifications ====================
export const sendNotification = asyncHandler(async (req: Request, res: Response) => {
  const result = await adminService.sendNotification(req.body);
  return success(res, result, "Notification sent");
});

export const listSentNotifications = asyncHandler(async (req: Request, res: Response) => {
  const { page = "1", limit = "10" } = req.query;
  const result = await adminService.listSentNotifications(Number(page), Number(limit));
  return paginated(res, result.data, result.pagination);
});

// ==================== Revenue Data ====================
export const revenueData = asyncHandler(async (req: Request, res: Response) => {
  const data = await adminService.revenueData();
  return success(res, data);
});

export const uploadImage = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    const url = `/uploads/${req.file.filename}`;
    return success(res, { url, filename: req.file.filename }, "Image uploaded");
  },
);
