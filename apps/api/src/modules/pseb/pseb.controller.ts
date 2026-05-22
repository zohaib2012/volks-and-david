import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import { asyncHandler } from "../../utils/asyncHandler";
import { success, error } from "../../utils/response";
import { psebService } from "./pseb.service";

const UPLOADS_DIR = path.join(__dirname, "..", "..", "..", "uploads");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only images and PDFs allowed"));
  },
});

export const uploadMiddleware = upload.single("file");

export const uploadFile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) return error(res, "No file uploaded", 400);
  if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const ext = path.extname(req.file.originalname) || ".pdf";
  const filename = `pseb-${unique}${ext}`;
  fs.writeFileSync(path.join(UPLOADS_DIR, filename), req.file.buffer);
  return success(res, { url: `/uploads/${filename}` }, "File uploaded");
});

export const listCompany = asyncHandler(async (req: Request, res: Response) => {
  const records = await psebService.listCompany(req.user!.userId);
  return success(res, records);
});

export const getCompanyById = asyncHandler(async (req: Request, res: Response) => {
  const record = await psebService.getCompanyById(req.params.id);
  if (!record || record.userId !== req.user!.userId) return error(res, "Not found", 404);
  return success(res, record);
});

export const createCompany = asyncHandler(async (req: Request, res: Response) => {
  const record = await psebService.createCompany(req.user!.userId, req.body);
  return success(res, record, "PSEB Company registration submitted", 201);
});

export const updateCompany = asyncHandler(async (req: Request, res: Response) => {
  const record = await psebService.getCompanyById(req.params.id);
  if (!record || record.userId !== req.user!.userId) return error(res, "Not found", 404);
  const updated = await psebService.updateCompany(req.params.id, req.body);
  return success(res, updated);
});

export const listCallCenter = asyncHandler(async (req: Request, res: Response) => {
  const records = await psebService.listCallCenter(req.user!.userId);
  return success(res, records);
});

export const getCallCenterById = asyncHandler(async (req: Request, res: Response) => {
  const record = await psebService.getCallCenterById(req.params.id);
  if (!record || record.userId !== req.user!.userId) return error(res, "Not found", 404);
  return success(res, record);
});

export const createCallCenter = asyncHandler(async (req: Request, res: Response) => {
  const record = await psebService.createCallCenter(req.user!.userId, req.body);
  return success(res, record, "PSEB Call Center registration submitted", 201);
});

export const updateCallCenter = asyncHandler(async (req: Request, res: Response) => {
  const record = await psebService.getCallCenterById(req.params.id);
  if (!record || record.userId !== req.user!.userId) return error(res, "Not found", 404);
  const updated = await psebService.updateCallCenter(req.params.id, req.body);
  return success(res, updated);
});

export const adminListCompany = asyncHandler(async (req: Request, res: Response) => {
  const records = await psebService.adminListCompany({
    status: req.query.status as string,
    search: req.query.search as string,
  });
  return success(res, records);
});

export const adminListCallCenter = asyncHandler(async (req: Request, res: Response) => {
  const records = await psebService.adminListCallCenter({
    status: req.query.status as string,
    search: req.query.search as string,
  });
  return success(res, records);
});

export const adminReviewCompany = asyncHandler(async (req: Request, res: Response) => {
  const updated = await psebService.adminReviewCompany(req.params.id, req.body);
  return success(res, updated, "Company registration updated");
});

export const adminReviewCallCenter = asyncHandler(async (req: Request, res: Response) => {
  const updated = await psebService.adminReviewCallCenter(req.params.id, req.body);
  return success(res, updated, "Call Center registration updated");
});

export const adminUploadCompanyDoc = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) return error(res, "No file uploaded", 400);
  if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const ext = path.extname(req.file.originalname) || ".pdf";
  const filename = `pseb-${unique}${ext}`;
  fs.writeFileSync(path.join(UPLOADS_DIR, filename), req.file.buffer);
  const url = `/uploads/${filename}`;
  await psebService.updateCompany(req.params.id, { adminDocUrl: url, adminDocName: req.file.originalname });
  return success(res, { url, name: req.file.originalname }, "Document uploaded");
});

export const adminUploadCallCenterDoc = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) return error(res, "No file uploaded", 400);
  if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const ext = path.extname(req.file.originalname) || ".pdf";
  const filename = `pseb-${unique}${ext}`;
  fs.writeFileSync(path.join(UPLOADS_DIR, filename), req.file.buffer);
  const url = `/uploads/${filename}`;
  await psebService.updateCallCenter(req.params.id, { adminDocUrl: url, adminDocName: req.file.originalname });
  return success(res, { url, name: req.file.originalname }, "Document uploaded");
});
