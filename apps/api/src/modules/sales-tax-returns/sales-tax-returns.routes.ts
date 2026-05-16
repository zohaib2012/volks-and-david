import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import * as controller from "./sales-tax-returns.controller";

const router = Router();
router.use(authenticate);

router.get("/", controller.list);
router.get("/:id", controller.getById);
router.post("/", controller.create);

export default router;
