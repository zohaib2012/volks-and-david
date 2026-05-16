import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import * as controller from "./fbr-profile.controller";

const router = Router();
router.use(authenticate);

router.get("/", controller.getProfile);
router.put("/", controller.updateProfile);

export default router;
