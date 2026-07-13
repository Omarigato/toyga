import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requireAuth, clearCookieHeader } from '../_auth';

export default function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'DELETE') {
        res.setHeader('Set-Cookie', clearCookieHeader());
        return res.status(204).end();
    }

    if (req.method === 'GET') {
        const payload = requireAuth(req, res);
        if (!payload) return; // requireAuth already sent 401 response
        return res.status(200).json({ email: payload.email });
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
