import type { VercelResponse } from '@vercel/node';
import { Readable } from 'stream';
import { withHandler, query } from '../../_core';
import { ValidationError, NotFoundError, ForbiddenError } from '../../_core/errors';
import { drive, getFolderId } from '../../_drive';

export default withHandler(
  async (req, res: VercelResponse) => {
    const { id } = req.query;
    const eventId = parseInt(id as string);
    if (isNaN(eventId)) {
      throw new ValidationError('Invalid event id');
    }

    // Verify event ownership
    const { rows: eventRows } = await query<{ user_id: string; template_id: string | null }>(
      'SELECT user_id, template_id FROM events WHERE id = $1 AND deleted_at IS NULL',
      [eventId]
    );

    if (eventRows.length === 0) {
      throw new NotFoundError('Event');
    }

    const event = eventRows[0];
    if (req.ctx.role !== 'admin' && parseInt(event.user_id) !== req.ctx.userId) {
      throw new ForbiddenError('You do not own this event');
    }

    // ─── GET: Fetch Invitation Layout ────────────────────────────────────────
    if (req.method === 'GET') {
      const { rows } = await query<{ content: any; rendered_image_url: string | null }>(
        'SELECT content, rendered_image_url FROM event_invitations WHERE event_id = $1 LIMIT 1',
        [eventId]
      );

      if (rows.length === 0) {
        res.status(200).json({ content: null, rendered_image_url: null });
        return;
      }

      res.status(200).json(rows[0]);
      return;
    }

    // ─── PUT: Save Invitation Layout ─────────────────────────────────────────
    if (req.method === 'PUT') {
      const { content, rendered_image_data } = req.body;
      if (!content) {
        throw new ValidationError('content field is required');
      }

      let renderedImageUrl: string | null = null;

      // If base64 preview is supplied, upload it to Google Drive
      if (rendered_image_data && typeof rendered_image_data === 'string' && rendered_image_data.startsWith('data:image/')) {
        try {
          const base64Data = rendered_image_data.replace(/^data:image\/\w+;base64,/, '');
          const buffer = Buffer.from(base64Data, 'base64');
          const stream = Readable.from(buffer);

          const parentFolderId = getFolderId('client/photos');
          const driveRes = await drive.files.create({
            requestBody: {
              name: `rendered-event-${eventId}-${Date.now()}.png`,
              parents: [parentFolderId],
            },
            media: {
              mimeType: 'image/png',
              body: stream,
            },
            fields: 'id',
          });

          const fileId = driveRes.data.id;
          if (fileId) {
            renderedImageUrl = `/api/media/${fileId}`;
          }
        } catch (err: any) {
          console.error('Failed to upload canvas PNG to Drive:', err.message);
        }
      }

      // Check if invitation already exists in event_invitations
      const { rows: invRows } = await query<{ id: string }>(
        'SELECT id FROM event_invitations WHERE event_id = $1 LIMIT 1',
        [eventId]
      );

      const templateId = event.template_id ? parseInt(event.template_id) : null;
      if (!templateId) {
        throw new ValidationError('Event does not have an assigned template');
      }

      if (invRows.length > 0) {
        // Update existing invitation
        const setQuery = renderedImageUrl 
          ? 'UPDATE event_invitations SET content = $1, rendered_image_url = $2, version = version + 1, updated_at = NOW() WHERE event_id = $3 RETURNING *'
          : 'UPDATE event_invitations SET content = $1, version = version + 1, updated_at = NOW() WHERE event_id = $2 RETURNING *';
        
        const params = renderedImageUrl ? [JSON.stringify(content), renderedImageUrl, eventId] : [JSON.stringify(content), eventId];
        const { rows } = await query(setQuery, params);
        res.status(200).json(rows[0]);
      } else {
        // Insert new invitation
        const { rows } = await query(
          `INSERT INTO event_invitations (event_id, template_id, content, rendered_image_url, version)
           VALUES ($1, $2, $3, $4, 1)
           RETURNING *`,
          [eventId, templateId, JSON.stringify(content), renderedImageUrl || null]
        );
        res.status(201).json(rows[0]);
      }
      return;
    }
  },
  {
    methods: ['GET', 'PUT'],
    auth: 'any',
  }
);
