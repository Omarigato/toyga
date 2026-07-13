import type { VercelResponse } from '@vercel/node';
import { withHandler, query, transaction } from '../../../_core';
import { ValidationError, NotFoundError, ForbiddenError } from '../../../_core/errors';
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

    // ─── POST: Import Guest Contacts List ────────────────────────────────────
    if (req.method === 'POST') {
      const guests = req.body;
      if (!Array.isArray(guests)) {
        throw new ValidationError('Request body must be an array of guest objects');
      }

      if (guests.length === 0) {
        res.status(200).json([]);
        return;
      }

      // Perform inserts in a single transaction
      const imported: any[] = [];
      await transaction(async (client) => {
        for (const guest of guests) {
          const { full_name, phone, greeting_text } = guest;
          if (!full_name || !phone) {
            throw new ValidationError('Each guest must have full_name and phone fields');
          }

          const personalSlug = `${eventId}-${nanoid(10)}`;
          const { rows } = await client.query(
            `INSERT INTO guest_contacts (event_id, full_name, phone, personal_slug, greeting_text, send_status)
             VALUES ($1, $2, $3, $4, $5, 'pending')
             RETURNING id, event_id, full_name, phone, personal_slug, greeting_text, send_status`,
            [eventId, full_name, phone, personalSlug, greeting_text || null]
          );
          imported.push(rows[0]);
        }
      });

      res.status(201).json(imported);
      return;
    }
  },
  {
    methods: ['POST'],
    auth: 'any',
  }
);
