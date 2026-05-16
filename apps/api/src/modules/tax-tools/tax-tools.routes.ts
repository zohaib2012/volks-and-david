import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import * as controller from "./tax-tools.controller";

const router = Router();
router.use(authenticate);

router.get("/atl-check/:cnic", controller.atlCheck);
router.get("/ntn-status/:cnic", controller.ntnStatus);

export default router;
