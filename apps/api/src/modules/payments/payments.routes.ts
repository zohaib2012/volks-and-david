import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import * as controller from "./payments.controller";

const router = Router();
router.use(authenticate);

router.get("/", controller.list);
router.get("/:id", controller.getById);

export default router;
