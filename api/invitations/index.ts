import type { VercelResponse } from '@vercel/node';
import { withHandler, requireAdmin } from '../_core';
import { eventService } from '../../src/core/factories';
import { z } from 'zod';
import { ValidationError } from '../_core/errors';

export default withHandler(
  async (req, res: VercelResponse) => {
    // ─── GET: List all invitations (admin) ───────────────────────────────────
    if (req.method === 'GET') {
      requireAdmin(req);
      const events = await eventService.listAllEvents();
      res.status(200).json(events);
      return;
    }

    // ─── POST: Create Invitation (Admin / User) ──────────────────────────────
    if (req.method === 'POST') {
      const userId = req.ctx.userId || req.ctx.adminId;
      if (!userId) {
        throw new ValidationError('Authentication required');
      }

      const schema = z.object({
        template_id: z.number().int().positive().optional(),
        short_slug: z.string().min(2).max(100),
        owner_name: z.string().min(1),
        owner_phone: z.string().optional(),
        event_type: z.string(),
        event_date: z.string(),
        event_location: z.string().optional(),
        event_lat: z.number().optional(),
        event_lng: z.number().optional(),
        audio_url: z.string().optional(),
        custom_data: z.record(z.string(), z.unknown()).optional(),
      });

      const body = schema.parse(req.body);

      const event = await eventService.createEvent({
        userId,
        templateId: body.template_id,
        slug: body.short_slug,
        ownerName: body.owner_name,
        ownerPhone: body.owner_phone,
        type: body.event_type,
        eventDate: body.event_date,
        audioUrl: body.audio_url,
        location: body.event_location,
        lat: body.event_lat,
        lng: body.event_lng,
        customData: body.custom_data,
      });

      res.status(201).json(event);
      return;
    }
  },
  {
    methods: ['GET', 'POST'],
    auth: 'any',
  }
);
