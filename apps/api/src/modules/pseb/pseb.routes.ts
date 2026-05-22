import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import * as controller from "./pseb.controller";

const router = Router();
router.use(authenticate);

router.post("/upload", controller.uploadMiddleware, controller.uploadFile);

router.get("/company", controller.listCompany);
router.get("/company/:id", controller.getCompanyById);
router.post("/company", controller.createCompany);
router.put("/company/:id", controller.updateCompany);

router.get("/call-center", controller.listCallCenter);
router.get("/call-center/:id", controller.getCallCenterById);
router.post("/call-center", controller.createCallCenter);
router.put("/call-center/:id", controller.updateCallCenter);

router.get("/admin/company", requireRole("ADMIN", "SUPER_ADMIN"), controller.adminListCompany);
router.get("/admin/call-center", requireRole("ADMIN", "SUPER_ADMIN"), controller.adminListCallCenter);
router.put("/admin/company/:id/review", requireRole("ADMIN", "SUPER_ADMIN"), controller.adminReviewCompany);
router.put("/admin/call-center/:id/review", requireRole("ADMIN", "SUPER_ADMIN"), controller.adminReviewCallCenter);
router.post("/admin/company/:id/upload-doc", requireRole("ADMIN", "SUPER_ADMIN"), controller.uploadMiddleware, controller.adminUploadCompanyDoc);
router.post("/admin/call-center/:id/upload-doc", requireRole("ADMIN", "SUPER_ADMIN"), controller.uploadMiddleware, controller.adminUploadCallCenterDoc);

export default router;
