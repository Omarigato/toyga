import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { AuthenticatedRequest, Handler, HandlerOptions } from './types';
import { AppError, ValidationError } from './errors';
import { authenticateUser, authenticateAdmin } from './middleware/requireAuth';
import { checkRateLimit } from './middleware/rateLimit';
import { ZodError } from 'zod';

/**
 * Universal handler wrapper for all Vercel API functions.
 * Eliminates boilerplate: try/catch, CORS, method filtering, auth, rate limiting.
 *
 * @example
 * // api/templates/index.ts
 * export default withHandler(async (req, res) => {
 *   const templates = await templateService.list();
 *   res.json(templates);
 * }, { methods: ['GET'], auth: 'user' });
 */
export function withHandler(fn: Handler, opts?: HandlerOptions) {
  return async (req: VercelRequest, res: VercelResponse): Promise<void> => {
    // ── CORS ──
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, X-Requested-With'
    );

    if (req.method === 'OPTIONS') {
      res.status(204).end();
      return;
    }

    // ── Method filter ──
    if (opts?.methods && !opts.methods.includes(req.method || '')) {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    try {
      // ── Rate limiting ──
      if (opts?.rateLimit) {
        const ip =
          (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
          req.socket?.remoteAddress ||
          'unknown';
        checkRateLimit(ip, opts.rateLimit.windowMs, opts.rateLimit.max);
      }

      // ── Authentication ──
      const authReq = req as AuthenticatedRequest;

      if (opts?.auth === 'admin') {
        authReq.ctx = authenticateAdmin(req);
      } else if (opts?.auth === 'user') {
        authReq.ctx = authenticateUser(req);
      } else if (opts?.auth === 'any') {
        // Try admin first, fall back to user
        try {
          authReq.ctx = authenticateAdmin(req);
        } catch {
          authReq.ctx = authenticateUser(req);
        }
      }

      // ── Execute handler ──
      await fn(authReq, res);
    } catch (err) {
      handleError(err, res);
    }
  };
}

/**
 * Map errors to HTTP responses.
 */
function handleError(err: unknown, res: VercelResponse): void {
  // Our custom app errors
  if (err instanceof AppError) {
    const body: Record<string, unknown> = {
      error: err.message,
      code: err.code,
    };
    if (err.field) body.field = err.field;
    if (err instanceof ValidationError && err.errors) {
      body.errors = err.errors;
    }
    res.status(err.statusCode).json(body);
    return;
  }

  // Zod validation errors (from schema.parse() in handlers)
  if (err instanceof ZodError) {
    const errors = err.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
    res.status(400).json({
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      errors,
    });
    return;
  }

  // Postgres unique constraint violation
  if (isPostgresError(err) && err.code === '23505') {
    const field = err.constraint?.replace(/_unique$|_key$/, '') || undefined;
    res.status(409).json({
      error: 'Resource already exists',
      code: 'CONFLICT',
      field,
    });
    return;
  }

  // Unknown errors — log and return 500
  console.error('[API ERROR]', err);
  res.status(500).json({
    error: 'Internal server error',
    code: 'INTERNAL_ERROR',
  });
}

/**
 * Check if error is a Postgres error (has `code` property).
 */
function isPostgresError(err: unknown): err is { code: string; constraint?: string } {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    typeof (err as Record<string, unknown>).code === 'string'
  );
}
