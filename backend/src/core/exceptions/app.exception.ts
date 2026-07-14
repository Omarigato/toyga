import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from '../../common/constants/error-codes';
import { SupportedLanguage } from '../i18n/i18n.service';

export class AppException extends HttpException {
  public readonly code: ErrorCode;
  public readonly language: SupportedLanguage;

  constructor(
    message: string,
    statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    code: ErrorCode = ErrorCode.INTERNAL_ERROR,
    language: SupportedLanguage = 'kk',
  ) {
    super(message, statusCode);
    this.code = code;
    this.language = language;
  }
}

export class ValidationAppException extends AppException {
  public readonly errors: Array<{ field: string; message: string }>;

  constructor(
    errors: Array<{ field: string; message: string }>,
    language: SupportedLanguage = 'kk',
  ) {
    super('Validation failed', HttpStatus.BAD_REQUEST, ErrorCode.VALIDATION_ERROR, language);
    this.errors = errors;
  }
}

export class UnauthorizedAppException extends AppException {
  constructor(message: string = 'Unauthorized', language: SupportedLanguage = 'kk') {
    super(message, HttpStatus.UNAUTHORIZED, ErrorCode.UNAUTHORIZED, language);
  }
}

export class ForbiddenAppException extends AppException {
  constructor(message: string = 'Forbidden', language: SupportedLanguage = 'kk') {
    super(message, HttpStatus.FORBIDDEN, ErrorCode.FORBIDDEN, language);
  }
}

export class NotFoundAppException extends AppException {
  constructor(entity: string = 'Resource', language: SupportedLanguage = 'kk') {
    super(`${entity} not found`, HttpStatus.NOT_FOUND, ErrorCode.NOT_FOUND, language);
  }
}

export class ConflictAppException extends AppException {
  constructor(message: string = 'Resource already exists', language: SupportedLanguage = 'kk') {
    super(message, HttpStatus.CONFLICT, ErrorCode.CONFLICT, language);
  }
}

export class RateLimitAppException extends AppException {
  constructor(message: string = 'Too many requests', language: SupportedLanguage = 'kk') {
    super(message, HttpStatus.TOO_MANY_REQUESTS, ErrorCode.RATE_LIMIT_EXCEEDED, language);
  }
}
