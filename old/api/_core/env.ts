import { z } from 'zod';

/**
 * Typed, Zod-validated access to process.env.
 * Validates once on first access, throws on missing required vars.
 * Optional vars have defaults or are nullable.
 */
const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  // JWT
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),

  // Google Drive Service Account
  GOOGLE_SERVICE_ACCOUNT_EMAIL: z.string().optional(),
  GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: z.string().optional(),

  // Google Drive Folder IDs
  DRIVE_FOLDER_TEMPLATES_PHOTOS: z.string().optional(),
  DRIVE_FOLDER_TEMPLATES_VIDEOS: z.string().optional(),
  DRIVE_FOLDER_TEMPLATES_AUDIOS: z.string().optional(),
  DRIVE_FOLDER_CLIENT_PHOTOS: z.string().optional(),
  DRIVE_FOLDER_CLIENT_VIDEOS: z.string().optional(),

  // Google OAuth
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_REDIRECT_URI: z.string().optional(),

  // WhatsApp Gateway
  WHATSAPP_GATEWAY_URL: z.string().url().optional(),
  WHATSAPP_GATEWAY_TOKEN: z.string().optional(),

  // App
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  APP_URL: z.string().url().default('http://localhost:5173'),
});

export type Env = z.infer<typeof envSchema>;

let _env: Env | null = null;

/**
 * Get validated environment variables.
 * Parses and caches on first call.
 */
export function getEnv(): Env {
  if (!_env) {
    const result = envSchema.safeParse(process.env);
    if (!result.success) {
      const formatted = result.error.issues
        .map((i) => `  ${i.path.join('.')}: ${i.message}`)
        .join('\n');
      throw new Error(`Environment validation failed:\n${formatted}`);
    }
    _env = result.data;
  }
  return _env;
}

/**
 * Reset cached env (for testing).
 */
export function resetEnv(): void {
  _env = null;
}
