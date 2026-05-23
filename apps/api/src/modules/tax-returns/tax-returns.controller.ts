import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { success, error, paginated } from "../../utils/response";
import { taxReturnService } from "./tax-returns.service";
import { uploadToCloud } from "../../lib/cloudinary";

export const list = asyncHandler(async (req: Request, res: Response) => {
  const { page = "1", limit = "10", ...filters } = req.query;
  const result = await taxReturnService.list(
    req.user!.userId,
    Number(page),
    Number(limit),
    filters,
  );
  return paginated(res, result.data, result.pagination);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const tr = await taxReturnService.getById(req.params.id);
  if (!tr || tr.userId !== req.user!.userId)
    return error(res, "Tax return not found", 404);
  return success(res, tr);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const tr = await taxReturnService.create(req.user!.userId, req.body);
  return success(res, tr, "Tax return created", 201);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const tr = await taxReturnService.update(
    req.params.id,
    req.user!.userId,
    req.body,
  );
  return success(res, tr, "Tax return updated");
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  await taxReturnService.remove(req.params.id, req.user!.userId);
  return success(res, null, "Tax return deleted");
});

export const uploadCnic = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) return error(res, "No file uploaded", 400);
  const url = await uploadToCloud(req.file.buffer, req.file.originalname);
  return success(res, { url }, "File uploaded");
});
