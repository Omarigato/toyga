import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export interface JwtPayload {
    adminId: number;
    email: string;
}

function parseCookies(cookieHeader: string | undefined): Record<string, string> {
    if (!cookieHeader) return {};
    return Object.fromEntries(
        cookieHeader.split(';').map((c) => {
            const [k, ...v] = c.trim().split('=');
            return [k, decodeURIComponent(v.join('='))];
        })
    );
}

export function requireAuth(
    req: VercelRequest,
    res: VercelResponse
): JwtPayload | null {
    if (!JWT_SECRET) {
        res.status(500).json({ error: 'JWT_SECRET not configured' });
        return null;
    }

    const cookies = parseCookies(req.headers.cookie);
    const token = cookies['token'];

    if (!token) {
        res.status(401).json({ error: 'Unauthorized' });
        return null;
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
        return payload;
    } catch {
        res.status(401).json({ error: 'Invalid or expired token' });
        return null;
    }
}

export function setCookieHeader(token: string): string {
    const isProd = process.env.NODE_ENV === 'production';
    return [
        `token=${token}`,
        'HttpOnly',
        'Path=/',
        'SameSite=Strict',
        `Max-Age=${7 * 24 * 60 * 60}`, // 7 days
        isProd ? 'Secure' : '',
    ]
        .filter(Boolean)
        .join('; ');
}

export function clearCookieHeader(): string {
    return 'token=; HttpOnly; Path=/; Max-Age=0';
}
