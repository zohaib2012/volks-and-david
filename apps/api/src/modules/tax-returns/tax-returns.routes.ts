import { Router } from "express";
import multer from "multer";
import { authenticate } from "../../middleware/auth.middleware";
import * as controller from "./tax-returns.controller";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const router = Router();
router.use(authenticate);

router.get("/", controller.list);
router.get("/:id", controller.getById);
router.post("/upload-cnic", upload.single("file"), controller.uploadCnic);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

export default router;
