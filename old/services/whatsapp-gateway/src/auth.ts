import type { Request, Response, NextFunction } from 'express';

/**
 * Express middleware to verify the Bearer token for requests.
 * Compares against the WHATSAPP_GATEWAY_TOKEN environment variable.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = process.env.WHATSAPP_GATEWAY_TOKEN;

  if (!token) {
    console.error('[GATEWAY AUTH] Error: WHATSAPP_GATEWAY_TOKEN is not configured on the server.');
    res.status(500).json({ error: 'Server authentication misconfigured' });
    return;
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Missing or malformed Bearer token' });
    return;
  }

  const clientToken = authHeader.substring(7);
  if (clientToken !== token) {
    res.status(403).json({ error: 'Forbidden: Invalid gateway token' });
    return;
  }

  next();
}
