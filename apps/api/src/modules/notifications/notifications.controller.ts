import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { success } from "../../utils/response";
import { notificationService } from "./notifications.service";

export const list = asyncHandler(async (req: Request, res: Response) => {
  const { type, unread } = req.query as { type?: string; unread?: string };
  const records = await notificationService.list(req.user!.userId, { type, unread });
  return success(res, records);
});

export const getUnreadCount = asyncHandler(async (req: Request, res: Response) => {
  const count = await notificationService.getUnreadCount(req.user!.userId);
  return success(res, { count });
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

export const getPreferences = asyncHandler(async (req: Request, res: Response) => {
  const prefs = await notificationService.getPreferences(req.user!.userId);
  return success(res, prefs);
});

export const updatePreferences = asyncHandler(async (req: Request, res: Response) => {
  const { preferences } = req.body;
  const saved = await notificationService.savePreferences(req.user!.userId, preferences);
  return success(res, saved, "Preferences saved");
});
