import type { VercelRequest, VercelResponse } from '@vercel/node';
import { pool } from '../_db';
import { requireAuth } from '../_auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'GET') {
        try {
            const { rows } = await pool.query(
                'SELECT * FROM categories ORDER BY sort_order ASC'
            );
            return res.status(200).json(rows);
        } catch (err) {
            console.error('[/api/categories]', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    if (req.method === 'POST') {
        if (!requireAuth(req, res)) return;

        const { slug, title_kk, image_url, sort_order } = req.body;
        try {
            const { rows } = await pool.query(
                `INSERT INTO categories (slug, title_kk, image_url, sort_order)
                 VALUES ($1, $2, $3, $4)
                 RETURNING *`,
                [slug, title_kk, image_url, sort_order || 0]
            );
            return res.status(201).json(rows[0]);
        } catch (err) {
            console.error('[/api/categories POST]', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    if (req.method === 'PUT') {
        if (!requireAuth(req, res)) return;

        const id = req.query.id;
        const { slug, title_kk, image_url, sort_order } = req.body;
        try {
            const { rows } = await pool.query(
                `UPDATE categories
                 SET slug = $1, title_kk = $2, image_url = $3, sort_order = $4
                 WHERE id = $5 RETURNING *`,
                [slug, title_kk, image_url, sort_order, id]
            );
            return res.status(200).json(rows[0]);
        } catch (err) {
            console.error('[/api/categories PUT]', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
