import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AppLoggerService } from '../logger/app-logger.service';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private readonly logger: AppLoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    const { method, url } = req;
    const requestId = req.headers['x-request-id'] as string;

    res.on('finish', () => {
      const duration = Date.now() - start;
      const logMessage = `${method} ${url} ${res.statusCode} ${duration}ms [${requestId}]`;

      if (duration > 500) {
        this.logger.warn(logMessage, 'LoggingMiddleware');
      } else {
        this.logger.log(logMessage, 'LoggingMiddleware');
      }
    });

    next();
  }
}
