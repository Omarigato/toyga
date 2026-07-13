import type { VercelResponse } from '@vercel/node';
import { withHandler, query } from '../_core';
import { eventService } from '../../src/core/factories';
import { createEventSchema } from '../../src/core/validation/events';
import { ValidationError } from '../_core/errors';

export default withHandler(
  async (req, res: VercelResponse) => {
    // ─── GET: List events (admin sees all, user sees their own) ──────────────
    if (req.method === 'GET') {
      if (req.ctx.role === 'admin') {
        const events = await eventService.listAllEvents();
        res.status(200).json(events);
      } else {
        const { rows } = await query(`
          SELECT 
            e.*,
            ea.address_text,
            ea.place_name,
            ea.lat,
            ea.lng,
            ea.map_link,
            t.title_kk as template_title
          FROM events e
          LEFT JOIN templates t ON e.template_id = t.id
          LEFT JOIN event_addresses ea ON ea.event_id = e.id
          WHERE e.user_id = $1 AND e.deleted_at IS NULL
          ORDER BY e.created_at DESC
        `, [req.ctx.userId]);
        res.status(200).json(rows);
      }
      return;
    }

    // ─── POST: Create Event ──────────────────────────────────────────────────
    if (req.method === 'POST') {
      const userId = req.ctx.userId || req.ctx.adminId;
      if (!userId) {
        throw new ValidationError('Authentication required');
      }

      const body = createEventSchema.parse(req.body);

      const event = await eventService.createEvent({
        userId,
        templateId: body.template_id,
        title: body.title,
        slug: body.slug,
        type: body.type,
        descriptionHtml: body.description_html,
        eventDate: body.event_date,
        program: body.program,
        hashtag: body.hashtag,
        audioUrl: body.audio_url,
        videoUrl: body.video_url,
        linkMode: body.link_mode,
        address: body.address,
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
