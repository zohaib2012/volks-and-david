import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { success, error, paginated } from "../../utils/response";
import { salesTaxReturnService } from "./sales-tax-returns.service";

export const list = asyncHandler(async (req: Request, res: Response) => {
  const { page = "1", limit = "10", ...filters } = req.query;
  const result = await salesTaxReturnService.list(
    req.user!.userId,
    Number(page),
    Number(limit),
    filters,
  );
  return paginated(res, result.data, result.pagination);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const record = await salesTaxReturnService.getById(req.params.id);
  if (!record || record.userId !== req.user!.userId)
    return error(res, "Sales tax return not found", 404);
  return success(res, record);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const record = await salesTaxReturnService.create(req.user!.userId, req.body);
  return success(res, record, "Sales tax return created", 201);
});
