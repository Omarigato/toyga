import { HTTP_STATUS, ERROR_CODES } from '../../src/core/constants';

/**
 * Base application error. All domain/API errors extend this.
 * withHandler() maps these to HTTP responses automatically.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly field?: string;

  constructor(
    message: string,
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    code: string = ERROR_CODES.INTERNAL_ERROR,
    field?: string
  ) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.field = field;
    // Ensure instanceof works correctly with TS class hierarchy
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * 400 Bad Request — validation failures, malformed input.
 */
export class ValidationError extends AppError {
  public readonly errors?: Array<{ field: string; message: string }>;

  constructor(
    message: string = 'Validation failed',
    field?: string,
    errors?: Array<{ field: string; message: string }>
  ) {
    super(message, HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR, field);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

/**
 * 401 Unauthorized — missing or invalid credentials.
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED);
    this.name = 'UnauthorizedError';
  }
}

/**
 * 403 Forbidden — authenticated but insufficient permissions.
 */
export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, HTTP_STATUS.FORBIDDEN, ERROR_CODES.FORBIDDEN);
    this.name = 'ForbiddenError';
  }
}

/**
 * 404 Not Found — requested resource doesn't exist.
 */
export class NotFoundError extends AppError {
  constructor(entity: string = 'Resource', id?: string | number) {
    const msg = id ? `${entity} #${id} not found` : `${entity} not found`;
    super(msg, HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND);
    this.name = 'NotFoundError';
  }
}

/**
 * 409 Conflict — duplicate entry, already exists.
 */
export class ConflictError extends AppError {
  constructor(message: string = 'Resource already exists', field?: string) {
    super(message, HTTP_STATUS.CONFLICT, ERROR_CODES.CONFLICT, field);
    this.name = 'ConflictError';
  }
}

/**
 * 429 Too Many Requests — rate limit exceeded.
 */
export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests, please try again later') {
    super(message, HTTP_STATUS.TOO_MANY_REQUESTS, ERROR_CODES.RATE_LIMIT_EXCEEDED);
    this.name = 'RateLimitError';
  }
}
