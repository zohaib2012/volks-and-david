import rateLimit from "express-rate-limit";

const isDev = process.env.NODE_ENV !== "production";

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 10000 : 100,
  message: {
    success: false,
    message: "Too many requests, please try again later",
    data: null,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 10000 : 50,
  message: {
    success: false,
    message: "Too many auth attempts, please try again later",
    data: null,
  },
  standardHeaders: true,
  legacyHeaders: false,
});
