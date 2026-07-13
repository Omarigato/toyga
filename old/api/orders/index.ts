import type { VercelRequest, VercelResponse } from '@vercel/node';
import { pool } from '../_db';
import { requireAuth } from '../_auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'GET') {
        if (!requireAuth(req, res)) return;

        try {
            const { rows } = await pool.query(`
                SELECT o.*, t.title as template_title 
                FROM orders o
                LEFT JOIN templates t ON o.template_id = t.id
                ORDER BY o.created_at DESC
            `);
            return res.status(200).json(rows);
        } catch (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    if (req.method === 'POST') {
        const { template_id, invitation_id, client_name, client_phone, channel, notes } = req.body;
        try {
            await pool.query(
                `INSERT INTO orders (template_id, invitation_id, client_name, client_phone, channel, notes)
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [template_id, invitation_id, client_name, client_phone, channel || 'whatsapp', notes]
            );
            return res.status(201).json({ success: true });
        } catch (err) {
            console.error('[/api/orders POST]', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    if (req.method === 'PUT') {
        if (!requireAuth(req, res)) return;
        const { id } = req.query;
        const { status } = req.body;
        try {
            await pool.query('UPDATE orders SET status = $1 WHERE id = $2', [status, id]);
            return res.status(200).json({ success: true });
        } catch (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
