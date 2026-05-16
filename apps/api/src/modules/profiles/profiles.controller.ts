import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { success, error } from "../../utils/response";
import { profileService } from "./profiles.service";

export const list = asyncHandler(async (req: Request, res: Response) => {
  const profiles = await profileService.list(req.user!.userId);
  return success(res, profiles);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const profile = await profileService.getById(req.params.id);
  if (!profile || profile.userId !== req.user!.userId)
    return error(res, "Profile not found", 404);
  return success(res, profile);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const profile = await profileService.create(req.user!.userId, req.body);
  return success(res, profile, "Profile created", 201);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const profile = await profileService.update(
    req.params.id,
    req.user!.userId,
    req.body,
  );
  return success(res, profile, "Profile updated");
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  await profileService.remove(req.params.id, req.user!.userId);
  return success(res, null, "Profile deleted");
});
