import { Request, Response, NextFunction } from "express";
import { error } from "../utils/response";

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return error(res, "Authentication required", 401);
    }

    if (!roles.includes(req.user.role)) {
      return error(res, "Insufficient permissions", 403);
    }

    next();
  };
}
