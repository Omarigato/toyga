import type { VercelRequest, VercelResponse } from '@vercel/node';
import { pool } from '../_db';
import { requireAuth } from '../_auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'GET') {
        if (!requireAuth(req, res)) return;

        try {
            const { rows } = await pool.query(`
                SELECT i.*, t.title as template_title 
                FROM invitations i
                LEFT JOIN templates t ON i.template_id = t.id
                ORDER BY i.created_at DESC
            `);
            return res.status(200).json(rows);
        } catch (err) {
            console.error('[/api/invitations GET]', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    if (req.method === 'POST') {
        if (!requireAuth(req, res)) return;

        const {
            template_id, short_slug, owner_name, owner_phone, event_type,
            event_date, event_location, event_lat, event_lng,
            cover_image_url, audio_url, custom_data
        } = req.body;

        try {
            const { rows } = await pool.query(
                `INSERT INTO invitations (
                    template_id, short_slug, owner_name, owner_phone, event_type,
                    event_date, event_location, event_lat, event_lng,
                    cover_image_url, audio_url, custom_data, status
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'published')
                RETURNING *`,
                [template_id, short_slug, owner_name, owner_phone, event_type,
                 event_date, event_location, event_lat, event_lng,
                 cover_image_url, audio_url, custom_data || {}]
            );
            return res.status(201).json(rows[0]);
        } catch (err) {
            console.error('[/api/invitations POST]', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
