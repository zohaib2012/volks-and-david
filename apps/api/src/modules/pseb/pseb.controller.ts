import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { success, error } from "../../utils/response";
import { psebService } from "./pseb.service";
import { cloudUpload, uploadToCloud } from "../../lib/cloudinary";

export const uploadMiddleware = cloudUpload.single("file");

export const uploadFile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) return error(res, "No file uploaded", 400);
  const url = await uploadToCloud(req.file.buffer, req.file.originalname);
  return success(res, { url }, "File uploaded");
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
  const url = await uploadToCloud(req.file.buffer, req.file.originalname);
  await psebService.updateCompany(req.params.id, { adminDocUrl: url, adminDocName: req.file.originalname });
  return success(res, { url, name: req.file.originalname }, "Document uploaded");
});

export const adminUploadCallCenterDoc = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) return error(res, "No file uploaded", 400);
  const url = await uploadToCloud(req.file.buffer, req.file.originalname);
  await psebService.updateCallCenter(req.params.id, { adminDocUrl: url, adminDocName: req.file.originalname });
  return success(res, { url, name: req.file.originalname }, "Document uploaded");
});
