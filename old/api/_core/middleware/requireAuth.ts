import type { VercelRequest } from '@vercel/node';
import jwt from 'jsonwebtoken';
import { getEnv } from '../env';
import { UnauthorizedError } from '../errors';
import type { RequestContext } from '../types';

/**
 * JWT payload for user tokens.
 */
interface UserJwtPayload {
  userId: number;
  role: 'user';
  email?: string;
}

/**
 * JWT payload for admin tokens.
 */
interface AdminJwtPayload {
  adminId: number;
  role: 'admin';
  email: string;
}

type JwtPayload = UserJwtPayload | AdminJwtPayload;

/**
 * Parse cookies from request header.
 */
function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  if (!cookieHeader) return {};
  return Object.fromEntries(
    cookieHeader.split(';').map((c) => {
      const [k, ...v] = c.trim().split('=');
      return [k, decodeURIComponent(v.join('='))];
    })
  );
}

/**
 * Extract and verify JWT token from request.
 * Checks httpOnly cookie 'token' first, then Authorization header.
 */
function extractToken(req: VercelRequest): JwtPayload {
  const env = getEnv();

  // Try cookie first
  const cookies = parseCookies(req.headers.cookie);
  let token = cookies['token'];

  // Fall back to Authorization header
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.slice(7);
    }
  }

  if (!token) {
    throw new UnauthorizedError('Authentication required');
  }

  try {
    return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
  } catch {
    throw new UnauthorizedError('Invalid or expired token');
  }
}

/**
 * Authenticate as a user. Returns RequestContext with userId.
 * Throws UnauthorizedError if token is missing/invalid or not a user token.
 */
export function authenticateUser(req: VercelRequest): RequestContext {
  const payload = extractToken(req);

  if ('userId' in payload) {
    return {
      userId: payload.userId,
      role: 'user',
      email: payload.email,
    };
  }

  // Admin tokens also pass if they include userId context
  if ('adminId' in payload) {
    return {
      adminId: payload.adminId,
      role: 'admin',
      email: payload.email,
    };
  }

  throw new UnauthorizedError('User authentication required');
}

/**
 * Authenticate as an admin. Returns RequestContext with adminId.
 * Throws UnauthorizedError if token is missing/invalid or not an admin token.
 */
export function authenticateAdmin(req: VercelRequest): RequestContext {
  const payload = extractToken(req);

  if ('adminId' in payload && payload.role === 'admin') {
    return {
      adminId: payload.adminId,
      role: 'admin',
      email: payload.email,
    };
  }

  throw new UnauthorizedError('Admin access required');
}

/**
 * Create a JWT token for a user.
 */
export function createUserToken(userId: number, email?: string): string {
  const env = getEnv();
  const payload: UserJwtPayload = { userId, role: 'user', email };
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as any });
}

/**
 * Create a JWT token for an admin.
 */
export function createAdminToken(adminId: number, email: string): string {
  const env = getEnv();
  const payload: AdminJwtPayload = { adminId, role: 'admin', email };
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as any });
}

/**
 * Set auth token as httpOnly cookie.
 */
export function setTokenCookie(token: string): string {
  const isProd = getEnv().NODE_ENV === 'production';
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

/**
 * Clear auth token cookie.
 */
export function clearTokenCookie(): string {
  return 'token=; HttpOnly; Path=/; Max-Age=0';
}
