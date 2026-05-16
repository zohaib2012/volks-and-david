import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import * as controller from "./settings.controller";

const router = Router();
router.use(authenticate);

router.get("/", controller.getSettings);
router.put("/theme", controller.updateTheme);

export default router;
