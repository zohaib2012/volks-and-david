import { Router } from "express";
import { authenticate, optionalAuth } from "../../middleware/auth.middleware";
import * as controller from "./blog.controller";

const router = Router();

router.get("/", optionalAuth, controller.list);
router.get("/:slug", optionalAuth, controller.getBySlug);

export default router;
