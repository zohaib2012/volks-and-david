import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import * as controller from "./referrals.controller";

const router = Router();
router.use(authenticate);

router.get("/stats", controller.stats);
router.get("/", controller.list);

export default router;
