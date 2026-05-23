import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { success, error } from "../../utils/response";
import { ntnService } from "./ntn.service";
import { uploadToCloud } from "../../lib/cloudinary";

export const list = asyncHandler(async (req: Request, res: Response) => {
  const records = await ntnService.list(req.user!.userId);
  return success(res, records);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const record = await ntnService.getById(req.params.id);
  if (!record || record.userId !== req.user!.userId)
    return error(res, "NTN registration not found", 404);
  return success(res, record);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const record = await ntnService.create(req.user!.userId, req.body);
  return success(res, record, "NTN registration submitted", 201);
});

export const uploadFiles = asyncHandler(async (req: Request, res: Response) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  if (!files || Object.keys(files).length === 0) return error(res, "No files uploaded", 400);
  const urls: Record<string, { url: string; originalName: string }> = {};
  for (const [field, fieldFiles] of Object.entries(files)) {
    if (fieldFiles.length > 0) {
      const file = fieldFiles[0];
      const url = await uploadToCloud(file.buffer, file.originalname);
      urls[field] = { url, originalName: file.originalname };
    }
  }
  return success(res, urls);
});
