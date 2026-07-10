import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requireAuth } from '../_auth';
import { drive } from '../_drive';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'DELETE') {
        if (!requireAuth(req, res)) return;

        const { fileId } = req.query;
        if (!fileId || typeof fileId !== 'string') {
            return res.status(400).json({ error: 'fileId is required' });
        }

        try {
            await drive.files.delete({ fileId });
            return res.status(204).end();
        } catch (err: any) {
            console.error('[/api/media/:fileId DELETE]', err.message);
            return res.status(500).json({ error: 'Failed to delete file' });
        }
    }

    if (req.method === 'GET') {
        const { fileId } = req.query;
        if (!fileId || typeof fileId !== 'string') {
            return res.status(400).json({ error: 'fileId is required' });
        }

        try {
            // Retrieve file metadata to get mimeType
            const meta = await drive.files.get({
                fileId,
                fields: 'mimeType, size',
            });

            // Get the file stream
            const response = await drive.files.get(
                { fileId, alt: 'media' },
                { responseType: 'stream' }
            );

            // Set caching and content type headers
            res.setHeader('Content-Type', meta.data.mimeType || 'application/octet-stream');
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
            if (meta.data.size) {
                res.setHeader('Content-Length', meta.data.size);
            }

            // Stream file to client
            response.data.pipe(res);
            
            // Handle stream errors so Vercel doesn't hang
            response.data.on('error', (err) => {
                console.error('Drive Stream Error:', err);
                if (!res.headersSent) res.status(500).end();
            });

        } catch (err: any) {
            console.error('[/api/media/:fileId GET]', err.message);
            if (err.code === 404) return res.status(404).json({ error: 'File not found' });
            return res.status(500).json({ error: 'Failed to retrieve file' });
        }
        return; // we piped the response
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
