import { Response } from "express";

export function success(
  res: Response,
  data: unknown = null,
  message = "Success",
  statusCode = 200,
) {
  return res.status(statusCode).json({ success: true, message, data });
}

export function error(
  res: Response,
  message = "Internal Server Error",
  statusCode = 500,
  errors?: Record<string, string[]>,
) {
  return res
    .status(statusCode)
    .json({ success: false, message, data: null, errors });
}

export function paginated(
  res: Response,
  data: unknown[],
  pagination: { page: number; limit: number; total: number },
  message = "Success",
) {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages: Math.ceil(pagination.total / pagination.limit),
    },
  });
}
