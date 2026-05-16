import jwt from "jsonwebtoken";
import { env } from "../config/env";

interface TokenPayload {
  userId: string;
  role: string;
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES as any,
  });
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
}

export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES as any,
  });
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload;
}
