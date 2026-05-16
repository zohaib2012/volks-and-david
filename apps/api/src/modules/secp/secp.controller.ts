import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { success, error } from "../../utils/response";
import { secpService } from "./secp.service";

export const list = asyncHandler(async (req: Request, res: Response) => {
  const records = await secpService.list(req.user!.userId);
  return success(res, records);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const record = await secpService.getById(req.params.id);
  if (!record || record.userId !== req.user!.userId)
    return error(res, "SECP registration not found", 404);
  return success(res, record);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const record = await secpService.create(req.user!.userId, req.body);
  return success(res, record, "SECP registration submitted", 201);
});
