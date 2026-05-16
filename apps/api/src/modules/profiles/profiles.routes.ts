import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import * as controller from "./profiles.controller";

const router = Router();
router.use(authenticate);

router.get("/", controller.list);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

export default router;
