import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Auth context attached to request by requireAuth/requireAdmin middleware.
 */
export interface RequestContext {
  userId?: number;
  adminId?: number;
  role: 'user' | 'admin';
  email?: string;
}

/**
 * Extended Vercel request with typed auth context.
 */
export interface AuthenticatedRequest extends VercelRequest {
  ctx: RequestContext;
}

/**
 * Handler function signature for use with withHandler().
 */
export type Handler = (
  req: AuthenticatedRequest,
  res: VercelResponse
) => Promise<void> | void;

/**
 * Options for withHandler() wrapper.
 */
export interface HandlerOptions {
  /** Require authentication. 'user' = user JWT, 'admin' = admin JWT, 'any' = either */
  auth?: 'user' | 'admin' | 'any';
  /** Allowed HTTP methods. Defaults to all. */
  methods?: string[];
  /** Rate limit config. Only applies if set. */
  rateLimit?: {
    windowMs: number;
    max: number;
  };
}
