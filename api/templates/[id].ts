import type { VercelRequest, VercelResponse } from '@vercel/node';
import { pool } from '../_db';
import { requireAuth } from '../_auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const { id } = req.query;

    if (req.method === 'GET') {
        try {
            const { rows } = await pool.query(
                `SELECT t.*, c.slug as category_slug, c.title_kk as category_title
                 FROM templates t
                 LEFT JOIN categories c ON t.category_id = c.id
                 WHERE t.id = $1`,
                [id]
            );
            if (!rows[0]) return res.status(404).json({ error: 'Not found' });
            return res.status(200).json(rows[0]);
        } catch (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    if (req.method === 'PUT') {
        if (!requireAuth(req, res)) return;

        const { category_id, title, description, price, extra_price, preview_image_url, is_free, is_active } = req.body;
        try {
            const { rows } = await pool.query(
                `UPDATE templates
                 SET category_id = $1, title = $2, description = $3, price = $4, extra_price = $5,
                     preview_image_url = $6, is_free = $7, is_active = $8
                 WHERE id = $9 RETURNING *`,
                [category_id, title, description, price, extra_price, preview_image_url, is_free, is_active, id]
            );
            return res.status(200).json(rows[0]);
        } catch (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
