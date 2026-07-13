import type { VercelResponse } from '@vercel/node';
import formidable from 'formidable';
import fs from 'fs';
import { withHandler, query } from './_core';
import { drive, getFolderId, MediaFolder } from './_drive';
import { ValidationError, ForbiddenError } from './_core/errors';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default withHandler(
  async (req, res: VercelResponse) => {
    const form = formidable({
      maxFileSize: 100 * 1024 * 1024, // 100MB limit
    });

    const [fields, files] = await form.parse(req);

    const folderParam = fields.folder?.[0] as MediaFolder | 'client/audios' | undefined;
    if (!folderParam) {
      throw new ValidationError('folder field is required');
    }

    const fileArray = files.file;
    const file = fileArray?.[0];
    if (!file) {
      throw new ValidationError('file field is required');
    }

    // Determine type and validate mime-types and size limits
    const isPhoto = folderParam.includes('photos');
    const isVideo = folderParam.includes('videos');
    const isAudio = folderParam.includes('audios');

    if (isPhoto && !file.mimetype?.startsWith('image/')) {
      throw new ValidationError('Expected image file');
    }
    if (isVideo && !file.mimetype?.startsWith('video/')) {
      throw new ValidationError('Expected video file');
    }
    if (isAudio && !file.mimetype?.startsWith('audio/')) {
      throw new ValidationError('Expected audio file');
    }

    const limits = {
      photo: 15 * 1024 * 1024,
      video: 100 * 1024 * 1024,
      audio: 20 * 1024 * 1024,
    };

    if (isPhoto && file.size > limits.photo) throw new ValidationError('Image exceeds 15MB');
    if (isVideo && file.size > limits.video) throw new ValidationError('Video exceeds 100MB');
    if (isAudio && file.size > limits.audio) throw new ValidationError('Audio exceeds 20MB');

    // Quotas limit check per event
    const eventIdParam = fields.event_id?.[0];
    if (eventIdParam) {
      const eventId = parseInt(eventIdParam);
      if (isNaN(eventId)) {
        throw new ValidationError('Invalid event_id');
      }

      // Check if current user is owner of the event
      if (req.ctx.role !== 'admin') {
        const { rows: eventRows } = await query(
          'SELECT user_id FROM events WHERE id = $1 AND deleted_at IS NULL',
          [eventId]
        );
        if (eventRows.length === 0) {
          throw new ValidationError('Event not found');
        }
        if (parseInt(eventRows[0].user_id) !== req.ctx.userId) {
          throw new ForbiddenError('You do not own this event');
        }
      }

      // Query database for counts
      const { rows: mediaRows } = await query<{ count: string; type: string }>(
        'SELECT count(*), type FROM event_media WHERE event_id = $1 AND deleted_at IS NULL GROUP BY type',
        [eventId]
      );

      let photosCount = 0;
      let videosCount = 0;
      for (const row of mediaRows) {
        if (row.type === 'image') photosCount = parseInt(row.count);
        if (row.type === 'video') videosCount = parseInt(row.count);
      }

      if (isPhoto && photosCount >= 20) {
        throw new ValidationError('Limit of 20 photos reached for this event');
      }
      if (isVideo && videosCount >= 3) {
        throw new ValidationError('Limit of 3 videos reached for this event');
      }
    }

    // Upload to Google Drive folder mapping
    let resolvedFolder: MediaFolder;
    if (folderParam === 'client/audios') {
      resolvedFolder = 'templates/audios';
    } else {
      resolvedFolder = folderParam as MediaFolder;
    }

    const parentFolderId = getFolderId(resolvedFolder);

    const driveRes = await drive.files.create({
      requestBody: {
        name: file.originalFilename || 'upload',
        parents: [parentFolderId],
      },
      media: {
        mimeType: file.mimetype || 'application/octet-stream',
        body: fs.createReadStream(file.filepath),
      },
      fields: 'id',
    });

    const fileId = driveRes.data.id;
    if (!fileId) throw new Error('Failed to get fileId from Google Drive');

    // Clean up temporary file asynchronously
    fs.unlink(file.filepath, () => {});

    res.status(200).json({
      fileId,
      url: `/api/media/${fileId}`,
    });
  },
  {
    methods: ['POST'],
    auth: 'any',
  }
);
