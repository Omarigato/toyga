import type { VercelResponse } from '@vercel/node';
import { withHandler, query } from '../../_core';
import { ValidationError, NotFoundError, ForbiddenError } from '../../_core/errors';
import { nanoid } from 'nanoid';

export default withHandler(
  async (req, res: VercelResponse) => {
    const { id } = req.query;
    const eventId = parseInt(id as string);
    if (isNaN(eventId)) {
      throw new ValidationError('Invalid event id');
    }

    // Verify event ownership
    const { rows: eventRows } = await query<{ user_id: string }>(
      'SELECT user_id FROM events WHERE id = $1 AND deleted_at IS NULL',
      [eventId]
    );

    if (eventRows.length === 0) {
      throw new NotFoundError('Event');
    }

    const event = eventRows[0];
    if (req.ctx.role !== 'admin' && parseInt(event.user_id) !== req.ctx.userId) {
      throw new ForbiddenError('You do not own this event');
    }

    // ─── GET: Fetch Guest Contacts List ──────────────────────────────────────
    if (req.method === 'GET') {
      const { rows } = await query(
        `SELECT id, event_id, full_name, phone, personal_slug, greeting_text, send_status 
         FROM guest_contacts 
         WHERE event_id = $1 AND deleted_at IS NULL 
         ORDER BY id DESC`,
        [eventId]
      );
      res.status(200).json(rows);
      return;
    }

    // ─── POST: Add Guest Contact ─────────────────────────────────────────────
    if (req.method === 'POST') {
      const { full_name, phone, greeting_text } = req.body;
      if (!full_name || !phone) {
        throw new ValidationError('full_name and phone are required');
      }

      // Generate a unique personal slug for RSVP redirection
      const personalSlug = `${eventId}-${nanoid(10)}`;

      const { rows } = await query(
        `INSERT INTO guest_contacts (event_id, full_name, phone, personal_slug, greeting_text, send_status)
         VALUES ($1, $2, $3, $4, $5, 'pending')
         RETURNING id, event_id, full_name, phone, personal_slug, greeting_text, send_status`,
        [eventId, full_name, phone, personalSlug, greeting_text || null]
      );

      res.status(201).json(rows[0]);
      return;
    }
  },
  {
    methods: ['GET', 'POST'],
    auth: 'any',
  }
);
