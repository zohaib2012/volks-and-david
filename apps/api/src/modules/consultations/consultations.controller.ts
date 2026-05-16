import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { success, error } from "../../utils/response";
import { consultationService } from "./consultations.service";

export const list = asyncHandler(async (req: Request, res: Response) => {
  const records = await consultationService.list(req.user!.userId);
  return success(res, records);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const record = await consultationService.getById(req.params.id);
  if (!record || record.userId !== req.user!.userId)
    return error(res, "Consultation not found", 404);
  return success(res, record);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const record = await consultationService.create(req.user!.userId, req.body);
  return success(res, record, "Consultation requested", 201);
});
