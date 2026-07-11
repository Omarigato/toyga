import { z } from 'zod';

/**
 * Reusable phone number schema.
 * Accepts formats: +77001234567, 87001234567, 77001234567
 */
export const phoneSchema = z
  .string()
  .min(10)
  .max(15)
  .regex(/^\+?[78]\d{10}$/, 'Invalid phone number format');

/**
 * Normalize phone to +7XXXXXXXXXX format.
 */
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('8') && digits.length === 11) {
    return `+7${digits.slice(1)}`;
  }
  if (digits.startsWith('7') && digits.length === 11) {
    return `+${digits}`;
  }
  return phone.startsWith('+') ? phone : `+${phone}`;
}

/**
 * Pagination query params schema.
 */
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type PaginationParams = z.infer<typeof paginationSchema>;

/**
 * ID parameter schema (for URL params like /api/events/:id).
 */
export const idParamSchema = z.coerce.number().int().positive();

/**
 * Slug parameter schema.
 */
export const slugSchema = z
  .string()
  .min(2)
  .max(100)
  .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens');

/**
 * Generic search/filter params.
 */
export const searchSchema = z.object({
  q: z.string().max(200).optional(),
  sort: z.enum(['created_at', 'updated_at', 'sort_order', 'title']).default('sort_order'),
  order: z.enum(['asc', 'desc']).default('asc'),
});

/**
 * Paginated response wrapper type.
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
