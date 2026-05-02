import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const configSchema = z.object({
  YAHOO_EMAIL: z.string().email(),
  YAHOO_APP_PASSWORD: z.string().min(16),
  LOG_LEVEL: z.enum(["error", "warn", "info", "debug"]).default("info"),
});

const result = configSchema.safeParse(process.env);

if (!result.success) {
  console.error("❌ Invalid environment variables:", result.error.format());
  process.exit(1);
}

export const config = result.data;
