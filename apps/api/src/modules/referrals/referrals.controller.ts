import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { success } from "../../utils/response";
import { referralService } from "./referrals.service";

export const stats = asyncHandler(async (req: Request, res: Response) => {
  const data = await referralService.stats(req.user!.userId);
  return success(res, data);
});

export const list = asyncHandler(async (req: Request, res: Response) => {
  const records = await referralService.list(req.user!.userId);
  return success(res, records);
});
