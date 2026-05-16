import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import * as usaServicesController from "./usa-services.controller";

const router = Router();
router.use(authenticate);

router.post("/llc", usaServicesController.applyLLC);
router.post("/ein", usaServicesController.applyEIN);
router.post("/itin", usaServicesController.applyITIN);
router.post("/bank", usaServicesController.applyBank);
router.post("/package", usaServicesController.applyPackage);
router.get("/", usaServicesController.getAll);
router.get("/:id", usaServicesController.getOne);

export default router;
