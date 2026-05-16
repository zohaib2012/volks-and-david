import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { error } from "../utils/response";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: string;
      };
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return error(res, "Authentication required", 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return error(res, "Invalid or expired token", 401);
  }
}

export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
  } catch {
    // ignore invalid token for optional auth
  }

  next();
}
