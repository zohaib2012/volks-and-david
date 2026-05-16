import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import * as controller from "./withholding-tax.controller";

const router = Router();
router.use(authenticate);

router.get("/", controller.list);
router.post("/", controller.create);
router.get("/:id", controller.getById);

export default router;
