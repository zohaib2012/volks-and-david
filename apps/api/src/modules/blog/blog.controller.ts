import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { success, error, paginated } from "../../utils/response";
import { blogService } from "./blog.service";

export const list = asyncHandler(async (req: Request, res: Response) => {
  const { page = "1", limit = "10", ...filters } = req.query;
  const result = await blogService.list(
    Number(page),
    Number(limit),
    filters,
    req.user?.role !== "ADMIN",
  );
  return paginated(res, result.data, result.pagination);
});

export const getBySlug = asyncHandler(async (req: Request, res: Response) => {
  const post = await blogService.getBySlug(req.params.slug);
  if (!post) return error(res, "Blog post not found", 404);
  return success(res, post);
});
