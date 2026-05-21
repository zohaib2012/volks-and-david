import { Router } from "express";
import multer from "multer";
import path from "path";
import { authenticate } from "../../middleware/auth.middleware";
import { env } from "../../config/env";
import * as controller from "./tax-returns.controller";

const storage = multer.diskStorage({
  destination: path.join(__dirname, "..", "..", "..", "uploads"),
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "cnic-" + unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

const router = Router();
router.use(authenticate);

router.get("/", controller.list);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.post("/upload-cnic", upload.single("file"), controller.uploadCnic);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

export default router;
