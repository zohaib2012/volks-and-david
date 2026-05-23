import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { cloudUpload } from "../../lib/cloudinary";
import * as controller from "./documents.controller";

const upload = cloudUpload;

const router = Router();
router.use(authenticate);

router.get("/", controller.list);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.post("/upload", upload.single("file"), controller.upload);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

export default router;
