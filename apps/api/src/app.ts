import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import { generalLimiter } from "./middleware/rateLimiter";

import authRoutes from "./modules/auth/auth.routes";
import dashboardRoutes from "./modules/dashboard/dashboard.routes";
import usersRoutes from "./modules/users/users.routes";
import profilesRoutes from "./modules/profiles/profiles.routes";
import taxReturnsRoutes from "./modules/tax-returns/tax-returns.routes";
import ntnRoutes from "./modules/ntn/ntn.routes";
import gstRoutes from "./modules/gst/gst.routes";
import salesTaxReturnsRoutes from "./modules/sales-tax-returns/sales-tax-returns.routes";
import salesTaxNoticesRoutes from "./modules/sales-tax-notices/sales-tax-notices.routes";
import withholdingTaxRoutes from "./modules/withholding-tax/withholding-tax.routes";
import secpRoutes from "./modules/secp/secp.routes";
import ipServicesRoutes from "./modules/ip-services/ip-services.routes";
import fbrProfileRoutes from "./modules/fbr-profile/fbr-profile.routes";
import taxToolsRoutes from "./modules/tax-tools/tax-tools.routes";
import expenseTrackerRoutes from "./modules/expense-tracker/expense-tracker.routes";
import documentsRoutes from "./modules/documents/documents.routes";
import consultationsRoutes from "./modules/consultations/consultations.routes";
import fbrNoticesRoutes from "./modules/fbr-notices/fbr-notices.routes";
import paymentsRoutes from "./modules/payments/payments.routes";
import referralsRoutes from "./modules/referrals/referrals.routes";
import notificationsRoutes from "./modules/notifications/notifications.routes";
import blogRoutes from "./modules/blog/blog.routes";
import videosRoutes from "./modules/videos/videos.routes";
import faqsRoutes from "./modules/faqs/faqs.routes";
import settingsRoutes from "./modules/settings/settings.routes";
import adminRoutes from "./modules/admin/admin.routes";
import usaServicesRoutes from "./modules/usa-services/usa-services.routes";

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
const allowedOrigins = env.CORS_ORIGIN.split(",").map((o) => o.trim());
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(generalLimiter);
app.use("/uploads", express.static(path.join(__dirname, "..", env.UPLOAD_DIR)));

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/profiles", profilesRoutes);
app.use("/api/tax-returns", taxReturnsRoutes);
app.use("/api/ntn", ntnRoutes);
app.use("/api/gst", gstRoutes);
app.use("/api/sales-tax-returns", salesTaxReturnsRoutes);
app.use("/api/sales-tax-notices", salesTaxNoticesRoutes);
app.use("/api/withholding-tax", withholdingTaxRoutes);
app.use("/api/secp", secpRoutes);
app.use("/api/ip-services", ipServicesRoutes);
app.use("/api/fbr-profile", fbrProfileRoutes);
app.use("/api/tax-tools", taxToolsRoutes);
app.use("/api/expenses", expenseTrackerRoutes);
app.use("/api/documents", documentsRoutes);
app.use("/api/consultations", consultationsRoutes);
app.use("/api/fbr-notices", fbrNoticesRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/referrals", referralsRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/videos", videosRoutes);
app.use("/api/faqs", faqsRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/usa-services", usaServicesRoutes);

app.get("/api/health", (_, res) => {
  res.json({
    success: true,
    message: "API is running",
    data: { uptime: process.uptime() },
  });
});

app.use(errorHandler);

export default app;
