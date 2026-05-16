import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { success, error } from "../../utils/response";
import { videoService } from "./videos.service";

export const list = asyncHandler(async (req: Request, res: Response) => {
  const records = await videoService.list(req.user?.role !== "ADMIN");
  return success(res, records);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const record = await videoService.getById(req.params.id);
  if (!record) return error(res, "Video not found", 404);
  return success(res, record);
});
