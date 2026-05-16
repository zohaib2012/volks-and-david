import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { success, error } from "../../utils/response";
import { paymentService } from "./payments.service";

export const list = asyncHandler(async (req: Request, res: Response) => {
  const records = await paymentService.list(req.user!.userId);
  return success(res, records);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const record = await paymentService.getById(req.params.id);
  if (!record || record.userId !== req.user!.userId)
    return error(res, "Payment not found", 404);
  return success(res, record);
});
