import { Router } from "express";
import multer from "multer";
import path from "path";
import { authenticate } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import * as controller from "./admin.controller";

const storage = multer.diskStorage({
  destination: path.join(__dirname, "..", "..", "..", "uploads"),
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});

const router = Router();
router.use(authenticate);
router.use(requireRole("ADMIN", "SUPER_ADMIN"));

// Dashboard
router.get("/dashboard/stats", controller.dashboardStats);
router.get("/dashboard", controller.adminDashboard);

// Users
router.get("/users", controller.listUsers);
router.post("/users", controller.createUser);
router.put("/users/:id", controller.updateUser);
router.delete("/users/:id", controller.deleteUser);

// Tax Returns
router.get("/tax-returns", controller.listTaxReturns);
router.put("/tax-returns/bulk-assign", controller.bulkAssignReturns);
router.put("/tax-returns/:id/review", controller.reviewReturn);
router.put("/tax-returns/:id", controller.updateTaxReturn);

// Consultants
router.get("/consultants", controller.listConsultants);
router.post("/consultants", controller.createConsultant);
router.put("/consultants/:id", controller.updateConsultant);
router.delete("/consultants/:id", controller.deleteConsultant);

// Payments
router.get("/payments", controller.listPayments);
router.put("/payments/:id", controller.updatePayment);
router.put("/payments/:id/refund", controller.refundPayment);

// Blog
router.get("/blog", controller.listBlog);
router.post("/blog", controller.createBlog);
router.put("/blog/:id", controller.updateBlog);
router.delete("/blog/:id", controller.deleteBlog);

// Videos
router.get("/videos", controller.listVideos);
router.post("/videos", controller.createVideo);
router.put("/videos/:id", controller.updateVideo);
router.delete("/videos/:id", controller.deleteVideo);

// FAQs
router.get("/faqs", controller.listFaqs);
router.post("/faqs", controller.createFaq);
router.put("/faqs/:id", controller.updateFaq);
router.delete("/faqs/:id", controller.deleteFaq);

// Notices (FBR)
router.get("/notices", controller.listNotices);
router.put("/notices/:id", controller.updateNotice);
router.put("/notices/:id/assign", controller.assignNotice);

// NTN Registrations
router.get("/ntn", controller.listNtn);
router.put("/ntn/:id", controller.updateNtn);

// GST Registrations
router.get("/gst", controller.listGst);
router.put("/gst/:id", controller.updateGst);

// SECP / Business Registrations
router.get("/secp", controller.listSecp);
router.put("/secp/:id", controller.updateSecp);

// IP Registrations (Patent, Trademark, Copyright)
router.get("/ip-registrations", controller.listIpRegistrations);
router.put("/ip-registrations/:id", controller.updateIpRegistration);

// Consultations
router.get("/consultations", controller.listConsultations);
router.put("/consultations/:id", controller.updateConsultation);

// Sales Tax Returns
router.get("/sales-tax-returns", controller.listSalesTaxReturns);
router.put("/sales-tax-returns/:id", controller.updateSalesTaxReturn);

// Sales Tax Notices
router.get("/sales-tax-notices", controller.listSalesTaxNotices);
router.put("/sales-tax-notices/:id", controller.updateSalesTaxNotice);

// Withholding Tax
router.get("/withholding-tax", controller.listWithholdingTax);
router.put("/withholding-tax/:id", controller.updateWithholdingTax);

// USA Services
router.get("/usa-services", controller.listUsaServices);
router.put("/usa-services/:id", controller.updateUsaService);

// Referrals
router.get("/referrals", controller.listReferrals);
router.put("/referrals/:id", controller.updateReferral);

// Activity Logs
router.get("/activity-logs", controller.listActivityLogs);

// Documents
router.get("/documents", controller.listDocuments);

// Expenses
router.get("/expenses", controller.listExpenses);

// Profiles
router.get("/profiles", controller.listProfiles);

// Settings
router.get("/settings", controller.getSettings);
router.put("/settings", controller.updateSettings);

// Notifications
router.post("/notifications", controller.sendNotification);
router.get("/notifications", controller.listSentNotifications);

// Revenue Data
router.get("/revenue-data", controller.revenueData);

// Upload
router.post("/upload/image", upload.single("image"), controller.uploadImage);

export default router;
