import type { VercelRequest, VercelResponse } from '@vercel/node';
import { pool } from '../_db';
import { requireAuth } from '../_auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'GET') {
        const { category, all } = req.query;
        try {
            let query = `
                SELECT t.*, c.slug as category_slug, c.title_kk as category_title
                FROM templates t
                LEFT JOIN categories c ON t.category_id = c.id
            `;
            const params: any[] = [];
            const conditions: string[] = [];

            if (!all) {
                conditions.push('t.is_active = true');
            }

            if (category) {
                conditions.push('c.slug = $1');
                params.push(category);
            }

            if (conditions.length > 0) {
                query += ' WHERE ' + conditions.join(' AND ');
            }

            query += ' ORDER BY t.sort_order ASC';

            const { rows } = await pool.query(query, params);
            return res.status(200).json(rows);
        } catch (err) {
            console.error('[/api/templates GET]', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    if (req.method === 'POST') {
        if (!requireAuth(req, res)) return;

        const { category_id, title, description, price, extra_price, preview_image_url, is_free, is_active } = req.body;
        try {
            const { rows } = await pool.query(
                `INSERT INTO templates (category_id, title, description, price, extra_price, preview_image_url, is_free, is_active)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
                [category_id, title, description, price, extra_price, preview_image_url, is_free, is_active]
            );
            return res.status(201).json(rows[0]);
        } catch (err) {
            console.error('[/api/templates POST]', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
