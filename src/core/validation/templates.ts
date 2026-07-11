import { z } from 'zod';

/**
 * POST /api/categories — create a new category (admin).
 */
export const createCategorySchema = z.object({
  slug: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  title_kk: z.string().min(1, 'Kazakh title is required').max(200),
  title_ru: z.string().max(200).optional().nullable(),
  icon_url: z.string().url().optional().nullable(),
  sort_order: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

/**
 * PUT /api/categories/:id — update a category (admin).
 */
export const updateCategorySchema = createCategorySchema.partial();

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

/**
 * POST /api/templates — create a new template (admin).
 */
export const createTemplateSchema = z.object({
  category_id: z.number().int().positive().optional().nullable(),
  code: z
    .string()
    .max(50)
    .regex(/^[a-z0-9-]+$/, 'Code must contain only lowercase letters, numbers, and hyphens')
    .optional()
    .nullable(),
  title_kk: z.string().min(1, 'Kazakh title is required').max(200),
  title_ru: z.string().max(200).optional().nullable(),
  preview_img: z.string().max(1000).optional().nullable(),
  envelope_img: z.string().max(1000).optional().nullable(),
  base_img: z.string().max(1000).optional().nullable(),
  content: z.record(z.string(), z.unknown()).optional().nullable(),
  design_tokens: z.record(z.string(), z.unknown()).optional().nullable(),
  price: z.number().int().min(0).default(0),
  is_premium: z.boolean().default(false),
  is_active: z.boolean().default(true),
  sort_order: z.number().int().min(0).default(0),
  source: z.string().max(500).optional().nullable(),
});

export type CreateTemplateInput = z.infer<typeof createTemplateSchema>;

/**
 * PUT /api/templates/:id — update a template (admin).
 */
export const updateTemplateSchema = createTemplateSchema.partial();

export type UpdateTemplateInput = z.infer<typeof updateTemplateSchema>;

/**
 * Template asset (audio/video/image for a template).
 */
export const createTemplateAssetSchema = z.object({
  template_id: z.number().int().positive(),
  type: z.enum(['audio', 'video', 'image']),
  url: z.string().min(1).max(1000),
  sort_order: z.number().int().min(0).default(0),
});

export type CreateTemplateAssetInput = z.infer<typeof createTemplateAssetSchema>;

/**
 * Event invitation content (Fabric.js JSON saved from editor).
 */
export const saveInvitationSchema = z.object({
  template_id: z.number().int().positive(),
  content: z.record(z.string(), z.unknown()),
});

export type SaveInvitationInput = z.infer<typeof saveInvitationSchema>;
