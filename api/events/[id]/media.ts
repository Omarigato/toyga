import type { VercelResponse } from '@vercel/node';
import { withHandler, query } from '../../_core';
import { ValidationError, NotFoundError, ForbiddenError } from '../../_core/errors';

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

    // ─── GET: Fetch Event Media List ─────────────────────────────────────────
    if (req.method === 'GET') {
      const { rows } = await query(
        'SELECT id, url, type, sort_order FROM event_media WHERE event_id = $1 AND deleted_at IS NULL ORDER BY sort_order ASC, id ASC',
        [eventId]
      );
      res.status(200).json(rows);
      return;
    }

    // ─── POST: Add Event Media ───────────────────────────────────────────────
    if (req.method === 'POST') {
      const { url, type, sort_order } = req.body;
      if (!url || !type) {
        throw new ValidationError('url and type are required');
      }
      if (type !== 'image' && type !== 'video') {
        throw new ValidationError('type must be "image" or "video"');
      }

      // Check count limit (max 20 images, 3 videos)
      const { rows: countRows } = await query<{ count: string; type: string }>(
        'SELECT count(*), type FROM event_media WHERE event_id = $1 AND deleted_at IS NULL GROUP BY type',
        [eventId]
      );

      let photosCount = 0;
      let videosCount = 0;
      for (const r of countRows) {
        if (r.type === 'image') photosCount = parseInt(r.count);
        if (r.type === 'video') videosCount = parseInt(r.count);
      }

      if (type === 'image' && photosCount >= 20) {
        throw new ValidationError('Limit of 20 photos reached');
      }
      if (type === 'video' && videosCount >= 3) {
        throw new ValidationError('Limit of 3 videos reached');
      }

      const { rows } = await query(
        `INSERT INTO event_media (event_id, url, type, sort_order)
         VALUES ($1, $2, $3, $4)
         RETURNING id, url, type, sort_order`,
        [eventId, url, type, sort_order || 0]
      );

      res.status(201).json(rows[0]);
      return;
    }

    // ─── DELETE: Remove Event Media ──────────────────────────────────────────
    if (req.method === 'DELETE') {
      const { mediaId } = req.query;
      const parsedMediaId = parseInt(mediaId as string);
      if (isNaN(parsedMediaId)) {
        throw new ValidationError('mediaId parameter is required');
      }

      const { rowCount } = await query(
        'UPDATE event_media SET deleted_at = NOW() WHERE id = $1 AND event_id = $2 AND deleted_at IS NULL',
        [parsedMediaId, eventId]
      );

      if ((rowCount ?? 0) === 0) {
        throw new NotFoundError('Media item not found or already deleted');
      }

      res.status(200).json({ success: true });
      return;
    }
  },
  {
    methods: ['GET', 'POST', 'DELETE'],
    auth: 'any',
  }
);
