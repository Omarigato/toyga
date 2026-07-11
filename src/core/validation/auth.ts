import { z } from 'zod';
import { phoneSchema } from './common';

/**
 * POST /api/auth/register — email+password registration.
 */
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(128),
});

export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * POST /api/auth/login — email+password login.
 */
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * POST /api/auth/otp-request — request OTP code via WhatsApp.
 */
export const otpRequestSchema = z.object({
  phone: phoneSchema,
  purpose: z.enum(['login', 'register']).default('login'),
});

export type OtpRequestInput = z.infer<typeof otpRequestSchema>;

/**
 * POST /api/auth/otp-verify — verify OTP code.
 */
export const otpVerifySchema = z.object({
  phone: phoneSchema,
  code: z.string().length(6, 'OTP code must be exactly 6 digits').regex(/^\d{6}$/, 'OTP must be digits only'),
  /** Name is required for registration, optional for login. */
  name: z.string().min(2).max(100).optional(),
});

export type OtpVerifyInput = z.infer<typeof otpVerifySchema>;

/**
 * Google OAuth callback params.
 */
export const googleCallbackSchema = z.object({
  code: z.string().min(1, 'Authorization code is required'),
  state: z.string().optional(),
});

export type GoogleCallbackInput = z.infer<typeof googleCallbackSchema>;
