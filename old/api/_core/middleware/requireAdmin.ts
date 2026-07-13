import type { VercelRequest } from '@vercel/node';
import { authenticateAdmin } from './requireAuth';
import type { RequestContext } from '../types';

/**
 * Require admin authentication.
 * Convenience re-export for clarity in handler options.
 *
 * @example
 * export default withHandler(handler, { auth: 'admin' });
 * // or use directly:
 * const ctx = requireAdmin(req);
 */
export function requireAdmin(req: VercelRequest): RequestContext {
  return authenticateAdmin(req);
}
