import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { success, error, paginated } from "../../utils/response";
import { expenseTrackerService } from "./expense-tracker.service";

export const list = asyncHandler(async (req: Request, res: Response) => {
  const { page = "1", limit = "10", ...filters } = req.query;
  const result = await expenseTrackerService.list(
    req.user!.userId,
    Number(page),
    Number(limit),
    filters,
  );
  return paginated(res, result.data, result.pagination);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const record = await expenseTrackerService.getById(req.params.id);
  if (!record || record.userId !== req.user!.userId)
    return error(res, "Expense not found", 404);
  return success(res, record);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const record = await expenseTrackerService.create(req.user!.userId, req.body);
  return success(res, record, "Expense created", 201);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const record = await expenseTrackerService.update(
    req.params.id,
    req.user!.userId,
    req.body,
  );
  return success(res, record, "Expense updated");
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  await expenseTrackerService.remove(req.params.id, req.user!.userId);
  return success(res, null, "Expense deleted");
});
