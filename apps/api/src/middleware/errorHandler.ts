import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error(`[Error] ${err.message}`, err.stack);

  if (err instanceof ZodError) {
    const errors: Record<string, string[]> = {};
    for (const issue of err.issues) {
      const path = issue.path.join(".");
      if (!errors[path]) errors[path] = [];
      errors[path].push(issue.message);
    }
    return res
      .status(400)
      .json({
        success: false,
        message: "Validation error",
        data: null,
        errors,
      });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      const target = (err.meta?.target as string[])?.join(", ");
      return res
        .status(409)
        .json({
          success: false,
          message: `Duplicate value for ${target}`,
          data: null,
        });
    }
    if (err.code === "P2025") {
      return res
        .status(404)
        .json({ success: false, message: "Resource not found", data: null });
    }
    return res
      .status(400)
      .json({ success: false, message: "Database error", data: null });
  }

  const statusCode = (err as any).statusCode || 500;
  const message = statusCode === 500 ? "Internal server error" : err.message;

  return res.status(statusCode).json({ success: false, message, data: null });
}
