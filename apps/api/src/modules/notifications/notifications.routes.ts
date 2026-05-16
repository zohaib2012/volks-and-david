import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import * as controller from "./notifications.controller";

const router = Router();
router.use(authenticate);

router.get("/", controller.list);
router.put("/preferences", controller.updatePreferences);
router.put("/read-all", controller.markAllRead);
router.put("/:id/read", controller.markRead);
router.delete("/:id", controller.remove);

export default router;
