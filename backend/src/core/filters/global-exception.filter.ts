import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppException } from '../exceptions/app.exception';
import { ErrorCode } from '../../common/constants/error-codes';
import { I18nService, SupportedLanguage } from '../i18n/i18n.service';
import { AppLoggerService } from '../logger/app-logger.service';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly i18n: I18nService,
    private readonly logger: AppLoggerService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const lang = (request.headers['accept-language']?.split(',')[0]?.substring(0, 2) || 'kk') as SupportedLanguage;
    const validLang = this.i18n.isValidLanguage(lang) ? lang : 'kk';

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = ErrorCode.INTERNAL_ERROR;
    let message = this.i18n.translate('INTERNAL_ERROR', validLang);
    let errors: Array<{ field: string; message: string }> | undefined;

    if (exception instanceof AppException) {
      status = exception.getStatus();
      code = exception.code;
      message = exception.message;
      if ('errors' in exception) {
        errors = (exception as any).errors;
      }
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exResponse = exception.getResponse();
      if (typeof exResponse === 'string') {
        message = exResponse;
      } else if (typeof exResponse === 'object') {
        const resObj = exResponse as any;
        message = resObj.message || message;
        code = resObj.errorCode || code;
        if (Array.isArray(resObj.message)) {
          errors = resObj.message.map((m: string) => ({ field: 'body', message: m }));
          message = this.i18n.translate('VALIDATION_ERROR', validLang);
          code = ErrorCode.VALIDATION_ERROR;
        }
      }
    } else if (exception instanceof Error) {
      message = this.i18n.translate('INTERNAL_ERROR', validLang);
      this.logger.error(`Unhandled exception: ${exception.message}`, exception.stack, 'GlobalExceptionFilter');
    }

    response.status(status).json({
      success: false,
      message,
      error: message,
      errorCode: code,
      ...(errors && { errors }),
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
