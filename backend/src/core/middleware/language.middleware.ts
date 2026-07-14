import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LanguageMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    const acceptLanguage = req.headers['accept-language']?.split(',')[0]?.substring(0, 2) || 'kk';
    const supportedLangs = ['kk', 'ru', 'en'];
    req.headers['x-language'] = supportedLangs.includes(acceptLanguage) ? acceptLanguage : 'kk';
    next();
  }
}
