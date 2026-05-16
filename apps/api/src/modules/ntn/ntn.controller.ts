import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { success, error } from "../../utils/response";
import { ntnService } from "./ntn.service";

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
