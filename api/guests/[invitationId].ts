import type { VercelRequest, VercelResponse } from '@vercel/node';
import { pool } from '../_db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const { invitationId } = req.query;

    if (req.method === 'GET') {
        try {
            const { rows } = await pool.query(
                'SELECT * FROM guests WHERE invitation_id = $1 ORDER BY created_at DESC',
                [invitationId]
            );
            return res.status(200).json(rows);
        } catch (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    if (req.method === 'POST') {
        const { name, rsvp_status, guest_count, message } = req.body;
        try {
            await pool.query(
                `INSERT INTO guests (invitation_id, name, rsvp_status, guest_count, message)
                 VALUES ($1, $2, $3, $4, $5)`,
                [invitationId, name, rsvp_status, guest_count, message]
            );
            return res.status(201).json({ success: true });
        } catch (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
