import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../_db';
import { setCookieHeader } from '../_auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, password, token } = req.body as { email?: string; password?: string; token?: string };

    if (!process.env.JWT_SECRET) {
        return res.status(500).json({ error: 'JWT_SECRET not configured' });
    }

    if (token) {
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            res.setHeader('Set-Cookie', setCookieHeader(token));
            return res.status(200).json({ ok: true, payload });
        } catch (err) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }
    }

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
    }

    try {
        const { rows } = await pool.query<{ id: number; email: string; password_hash: string }>(
            'SELECT id, email, password_hash FROM admins WHERE email = $1 LIMIT 1',
            [email.toLowerCase().trim()]
        );

        const admin = rows[0];
        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const valid = await bcrypt.compare(password, admin.password_hash);
        if (!valid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { adminId: admin.id, email: admin.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.setHeader('Set-Cookie', setCookieHeader(token));
        return res.status(200).json({ ok: true });
    } catch (err) {
        console.error('[/api/admin/login]', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
