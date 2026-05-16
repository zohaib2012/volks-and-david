import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import * as controller from "./users.controller";

const router = Router();
router.use(authenticate);

router.get("/", requireRole("ADMIN", "SUPER_ADMIN"), controller.list);
router.get("/:id", controller.getById);
router.put("/:id", controller.update);

export default router;
