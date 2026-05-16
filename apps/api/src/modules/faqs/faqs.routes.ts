import { Router } from "express";
import { optionalAuth } from "../../middleware/auth.middleware";
import * as controller from "./faqs.controller";

const router = Router();

router.get("/", optionalAuth, controller.list);
router.get("/:id", optionalAuth, controller.getById);

export default router;
