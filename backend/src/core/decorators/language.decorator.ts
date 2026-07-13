import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SupportedLanguage } from '../i18n/i18n.service';

export const Language = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): SupportedLanguage => {
    const request = ctx.switchToHttp().getRequest();
    return (request.headers['x-language'] as SupportedLanguage) || 'kk';
  },
);
