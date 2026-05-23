import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { cloudUpload } from "../../lib/cloudinary";
import * as controller from "./ntn.controller";

const upload = cloudUpload;

const router = Router();
router.use(authenticate);

router.get("/", controller.list);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.post(
  "/upload",
  upload.fields([
    { name: "cnicFront", maxCount: 1 },
    { name: "cnicBack", maxCount: 1 },
    { name: "addressProof", maxCount: 1 },
  ]),
  controller.uploadFiles,
);

export default router;
