import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string(),
  DIRECT_URL: z.string(),
  JWT_SECRET: z.string().min(20),
  JWT_REFRESH_SECRET: z.string().min(20),
  JWT_ACCESS_EXPIRES: z.string().default("15m"),
  JWT_REFRESH_EXPIRES: z.string().default("7d"),
  PORT: z.coerce.number().default(5001),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  FRONTEND_URL: z.string(),
  CORS_ORIGIN: z.string(),
  UPLOAD_DIR: z.string().default("uploads"),
  RESEND_API_KEY: z.string().optional(),
  FROM_EMAIL: z.string().optional(),
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_PHONE_NUMBER: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "Invalid environment variables:",
    parsed.error.flatten().fieldErrors,
  );
  process.exit(1);
}

export const env = parsed.data;
export type Env = z.infer<typeof envSchema>;
