import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { success } from "../../utils/response";
import { fbrProfileService } from "./fbr-profile.service";

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const profile = await fbrProfileService.getProfile(req.user!.userId);
  return success(res, profile);
});

export const updateProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const profile = await fbrProfileService.updateProfile(
      req.user!.userId,
      req.body,
    );
    return success(res, profile, "FBR profile updated");
  },
);
