import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { success, error } from "../../utils/response";
import { documentService } from "./documents.service";
import { uploadToCloud } from "../../lib/cloudinary";

export const upload = asyncHandler(async (req: Request, res: Response) => {
  const file = req.file as Express.Multer.File | undefined;
  if (!file) return error(res, "No file uploaded", 400);
  const fileUrl = await uploadToCloud(file.buffer, file.originalname);
  const record = await documentService.create(req.user!.userId, {
    name: req.body.name || file.originalname,
    type: req.body.type || null,
    taxYear: req.body.taxYear || null,
    notes: req.body.notes || null,
    fileUrl,
    fileSize: file.size,
  });
  return success(res, record, "Document uploaded", 201);
});

export const list = asyncHandler(async (req: Request, res: Response) => {
  const records = await documentService.list(req.user!.userId);
  return success(res, records);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const record = await documentService.getById(req.params.id);
  if (!record || record.userId !== req.user!.userId)
    return error(res, "Document not found", 404);
  return success(res, record);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const record = await documentService.create(req.user!.userId, req.body);
  return success(res, record, "Document created", 201);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const record = await documentService.update(
    req.params.id,
    req.user!.userId,
    req.body,
  );
  return success(res, record, "Document updated");
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  await documentService.remove(req.params.id, req.user!.userId);
  return success(res, null, "Document deleted");
});
