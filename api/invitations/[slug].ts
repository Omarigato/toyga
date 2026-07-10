import type { VercelRequest, VercelResponse } from '@vercel/node';
import { pool } from '../_db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'GET') {
        const { slug } = req.query;
        try {
            const { rows } = await pool.query(
                `SELECT i.*, t.title as template_title
                 FROM invitations i
                 LEFT JOIN templates t ON i.template_id = t.id
                 WHERE i.short_slug = $1 AND i.status = 'published'`,
                [slug]
            );
            if (!rows[0]) return res.status(404).json({ error: 'Not found' });
            return res.status(200).json(rows[0]);
        } catch (err) {
            console.error('[/api/invitations/:slug]', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
