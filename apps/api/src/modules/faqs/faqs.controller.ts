import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { success, error } from "../../utils/response";
import { faqService } from "./faqs.service";

export const list = asyncHandler(async (req: Request, res: Response) => {
  const records = await faqService.list(req.user?.role !== "ADMIN");
  return success(res, records);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const record = await faqService.getById(req.params.id);
  if (!record) return error(res, "FAQ not found", 404);
  return success(res, record);
});
