import { Router } from "express";
import multer from "multer";
import path from "path";
import { authenticate } from "../../middleware/auth.middleware";
import * as controller from "./documents.controller";

const storage = multer.diskStorage({
  destination: path.join(__dirname, "..", "..", "..", "uploads"),
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "doc-" + unique + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

const router = Router();
router.use(authenticate);

router.get("/", controller.list);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.post("/upload", upload.single("file"), controller.upload);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

export default router;
