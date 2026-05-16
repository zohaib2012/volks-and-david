import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { success } from "../../utils/response";
import { settingsService } from "./settings.service";

export const getSettings = asyncHandler(async (req: Request, res: Response) => {
  const settings = await settingsService.getSettings(req.user!.userId);
  return success(res, settings);
});

export const updateTheme = asyncHandler(async (req: Request, res: Response) => {
  const result = await settingsService.updateTheme(req.user!.userId, req.body);
  return success(res, result, "Theme updated");
});
