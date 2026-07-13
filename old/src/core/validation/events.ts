import { z } from 'zod';
import { EventType, LinkMode, SurveyStatus } from '../constants';

/**
 * Program item within an event (program agenda).
 */
export const programItemSchema = z.object({
  time: z.string().min(1),
  title: z.string().min(1),
});

/**
 * POST /api/events — create a new event.
 */
export const createEventSchema = z.object({
  template_id: z.number().int().positive().optional().nullable(),
  title: z.string().min(2, 'Title is required').max(200),
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  type: z.nativeEnum(EventType),
  description_html: z.string().max(5000).optional().nullable(),
  event_date: z.string().datetime({ offset: true }),
  program: z.array(programItemSchema).default([]),
  hashtag: z.string().max(100).optional().nullable(),
  audio_url: z.string().url().optional().nullable(),
  video_url: z.string().url().optional().nullable(),
  link_mode: z.nativeEnum(LinkMode).default(LinkMode.SHARED),

  // Address (optional nested object)
  address: z
    .object({
      address_text: z.string().min(1).max(500),
      place_name: z.string().max(200).optional().nullable(),
      lat: z.number().min(-90).max(90).optional().nullable(),
      lng: z.number().min(-180).max(180).optional().nullable(),
      map_link: z.string().url().max(1000).optional().nullable(),
    })
    .optional()
    .nullable(),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;

/**
 * PUT /api/events/:id — update an existing event.
 * All fields optional (partial update).
 */
export const updateEventSchema = createEventSchema.partial().omit({ slug: true });

export type UpdateEventInput = z.infer<typeof updateEventSchema>;

/**
 * RSVP survey submission (public, no auth required).
 */
export const submitSurveySchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  relation: z.string().max(100).optional().nullable(),
  status: z.nativeEnum(SurveyStatus),
  message: z.string().max(1000).optional().nullable(),
  additional_guests: z
    .array(z.object({ name: z.string().min(1).max(200) }))
    .max(20)
    .default([]),
});

export type SubmitSurveyInput = z.infer<typeof submitSurveySchema>;

/**
 * Guest contact for bulk import / manual entry.
 */
export const guestContactSchema = z.object({
  full_name: z.string().min(1).max(200),
  phone: z.string().min(10).max(15),
  greeting_text: z.string().max(500).optional().nullable(),
});

/**
 * Bulk guest import.
 */
export const bulkGuestImportSchema = z.object({
  guests: z.array(guestContactSchema).min(1).max(1000),
});

export type BulkGuestImportInput = z.infer<typeof bulkGuestImportSchema>;
