import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class AppLoggerService implements LoggerService {
  private context = 'App';

  setContext(context: string) {
    this.context = context;
  }

  log(message: string, context?: string) {
    console.log(`[${context || this.context}] ${message}`);
  }

  error(message: string, trace?: string, context?: string) {
    console.error(`[${context || this.context}] ${message}`, trace || '');
  }

  warn(message: string, context?: string) {
    console.warn(`[${context || this.context}] ${message}`);
  }

  debug(message: string, context?: string) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[${context || this.context}] ${message}`);
    }
  }

  verbose(message: string, context?: string) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[VERBOSE:${context || this.context}] ${message}`);
    }
  }
}
