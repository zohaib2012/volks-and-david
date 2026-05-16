import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { success, error } from "../../utils/response";
import { documentService } from "./documents.service";

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
