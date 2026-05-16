import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { success } from "../../utils/response";
import { notificationService } from "./notifications.service";

export const list = asyncHandler(async (req: Request, res: Response) => {
  const records = await notificationService.list(req.user!.userId);
  return success(res, records);
});

export const markRead = asyncHandler(async (req: Request, res: Response) => {
  await notificationService.markRead(req.params.id, req.user!.userId);
  return success(res, null, "Notification marked as read");
});

export const markAllRead = asyncHandler(async (req: Request, res: Response) => {
  await notificationService.markAllRead(req.user!.userId);
  return success(res, null, "All notifications marked as read");
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  await notificationService.remove(req.params.id, req.user!.userId);
  return success(res, null, "Notification deleted");
});

export const updatePreferences = asyncHandler(async (req: Request, res: Response) => {
  const { preferences } = req.body;
  return success(res, { preferences }, "Preferences saved");
});
