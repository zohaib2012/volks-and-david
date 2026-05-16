import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { success, error } from "../../utils/response";
import { fbrNoticeService } from "./fbr-notices.service";

export const list = asyncHandler(async (req: Request, res: Response) => {
  const records = await fbrNoticeService.list(req.user!.userId);
  return success(res, records);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const record = await fbrNoticeService.getById(req.params.id);
  if (!record || record.userId !== req.user!.userId)
    return error(res, "Notice not found", 404);
  return success(res, record);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const record = await fbrNoticeService.create(req.user!.userId, req.body);
  return success(res, record, "Notice created", 201);
});

export const respond = asyncHandler(async (req: Request, res: Response) => {
  const record = await fbrNoticeService.respond(
    req.params.id,
    req.user!.userId,
    req.body.response,
  );
  return success(res, record, "Response submitted");
});
