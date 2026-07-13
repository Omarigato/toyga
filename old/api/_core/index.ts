/**
 * API Core — barrel export.
 * Single import point for all core infrastructure.
 *
 * @example
 * import { withHandler, query, AppError, NotFoundError, getEnv } from '../_core';
 */

// Database
export { pool, query, transaction } from './db';

// Environment
export { getEnv } from './env';
export type { Env } from './env';

// Errors
export {
  AppError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  RateLimitError,
} from './errors';

// HTTP wrapper
export { withHandler } from './http';

// Types
export type {
  RequestContext,
  AuthenticatedRequest,
  Handler,
  HandlerOptions,
} from './types';

// Middleware
export {
  authenticateUser,
  authenticateAdmin,
  createUserToken,
  createAdminToken,
  setTokenCookie,
  clearTokenCookie,
} from './middleware/requireAuth';

export { requireAdmin } from './middleware/requireAdmin';
export { checkRateLimit } from './middleware/rateLimit';
