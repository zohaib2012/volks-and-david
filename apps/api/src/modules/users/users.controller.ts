import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { success, error, paginated } from "../../utils/response";
import { userService } from "./users.service";

export const list = asyncHandler(async (req: Request, res: Response) => {
  const { page = "1", limit = "10", ...filters } = req.query;
  const result = await userService.list(Number(page), Number(limit), filters);
  return paginated(res, result.data, result.pagination);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.getById(req.params.id);
  if (!user) return error(res, "User not found", 404);
  return success(res, user);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.update(req.params.id, req.body);
  return success(res, user, "User updated");
});
