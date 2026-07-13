import type { VercelResponse } from '@vercel/node';
import { withHandler, query } from '../_core';
import { drive } from '../_drive';
import { ValidationError, NotFoundError, ForbiddenError } from '../_core/errors';

export default withHandler(
  async (req, res: VercelResponse) => {
    const { fileId } = req.query;
    if (!fileId || typeof fileId !== 'string') {
      throw new ValidationError('fileId is required');
    }

    // ─── DELETE: Remove File ─────────────────────────────────────────────────
    if (req.method === 'DELETE') {
      // Security Check: If not admin, check if user owns the event media
      if (req.ctx.role !== 'admin') {
        const { rows } = await query<{ user_id: string }>(
          `SELECT e.user_id FROM event_media em
           JOIN events e ON em.event_id = e.id
           WHERE em.url LIKE $1 AND em.deleted_at IS NULL`,
          [`%/api/media/${fileId}%`]
        );
        if (rows.length === 0) {
          throw new ForbiddenError('Access denied. Non-event media can only be deleted by admins.');
        }
        if (parseInt(rows[0].user_id) !== req.ctx.userId) {
          throw new ForbiddenError('Access denied. You do not own this media.');
        }
      }

      try {
        await drive.files.delete({ fileId });
        res.status(204).end();
        return;
      } catch (err: any) {
        console.error('[/api/media/:fileId DELETE]', err.message);
        throw new Error('Failed to delete file from Google Drive');
      }
    }

    // ─── GET: Stream File ────────────────────────────────────────────────────
    if (req.method === 'GET') {
      try {
        // Retrieve file metadata to get mimeType and size
        const meta = await drive.files.get({
          fileId,
          fields: 'mimeType, size',
        });

        // Fetch file stream from drive
        const response = await drive.files.get(
          { fileId, alt: 'media' },
          { responseType: 'stream' }
        );

        // Set caching and headers
        res.setHeader('Content-Type', meta.data.mimeType || 'application/octet-stream');
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        if (meta.data.size) {
          res.setHeader('Content-Length', meta.data.size);
        }

        // Pipe stream
        response.data.pipe(res);

        response.data.on('error', (err) => {
          console.error('Drive Stream Error:', err);
          if (!res.headersSent) res.status(500).end();
        });
      } catch (err: any) {
        console.error('[/api/media/:fileId GET]', err.message);
        if (err.code === 404) {
          throw new NotFoundError('Media File');
        }
        throw new Error('Failed to retrieve file');
      }
    }
  },
  {
    methods: ['GET', 'DELETE'],
    // Read is public, delete requires user or admin auth
    auth: 'any',
  }
);
