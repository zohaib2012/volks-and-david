import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import * as controller from "./fbr-notices.controller";

const router = Router();
router.use(authenticate);

router.get("/", controller.list);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.post("/:id/respond", controller.respond);

export default router;
