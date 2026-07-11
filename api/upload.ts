import type { VercelRequest, VercelResponse } from '@vercel/node';
import formidable from 'formidable';
import fs from 'fs';
import { requireAuth } from './_auth';
import { drive, getFolderId, MediaFolder } from './_drive';

// Disable default Vercel body parser to allow formidable to stream the multipart body
export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!requireAuth(req, res)) return;

    const form = formidable({
        maxFileSize: 100 * 1024 * 1024, // 100MB limit
    });

    try {
        const [fields, files] = await form.parse(req);
        
        const folderParam = fields.folder?.[0] as MediaFolder | undefined;
        if (!folderParam) {
            return res.status(400).json({ error: 'folder field is required' });
        }

        const fileArray = files.file;
        const file = fileArray?.[0];
        if (!file) {
            return res.status(400).json({ error: 'file field is required' });
        }

        // Validate Mime Types and sizes
        const isPhoto = folderParam.includes('photos');
        const isVideo = folderParam.includes('videos');
        const isAudio = folderParam.includes('audios');

        if (isPhoto && !file.mimetype?.startsWith('image/')) {
            return res.status(400).json({ error: 'Expected image file' });
        }
        if (isVideo && !file.mimetype?.startsWith('video/')) {
            return res.status(400).json({ error: 'Expected video file' });
        }
        if (isAudio && !file.mimetype?.startsWith('audio/')) {
            return res.status(400).json({ error: 'Expected audio file' });
        }

        const limits = {
            photo: 15 * 1024 * 1024,
            video: 100 * 1024 * 1024,
            audio: 20 * 1024 * 1024,
        };

        if (isPhoto && file.size > limits.photo) return res.status(400).json({ error: 'Image exceeds 15MB' });
        if (isVideo && file.size > limits.video) return res.status(400).json({ error: 'Video exceeds 100MB (Note: Vercel free tier limits total body to 4.5MB anyway)' });
        if (isAudio && file.size > limits.audio) return res.status(400).json({ error: 'Audio exceeds 20MB' });

        const parentFolderId = getFolderId(folderParam);

        // Upload to Google Drive
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

        // Note: The Service Account needs to have the folder shared to it as "Editor", 
        // OR we can make the file accessible to "anyone with the link" right here.
        // It's safer to just stream it through our proxy which uses the service account auth anyway.
        // So we don't strictly need to alter file permissions here if we always use /api/media proxy.

        // Clean up temp file
        fs.unlink(file.filepath, () => {});

        return res.status(200).json({
            fileId,
            url: `/api/media/${fileId}`
        });

    } catch (err: any) {
        console.error('[/api/upload]', err);
        return res.status(500).json({ error: 'Upload failed' });
    }
}
