import { Global, Module } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';
import { AppLoggerService } from './logger/app-logger.service';
import { I18nService } from './i18n/i18n.service';
import { AppConfigService } from './config/app-config.service';
import { StorageModule } from './storage/storage.module';
import { AuditModule } from './audit/audit.module';

@Global()
@Module({
  imports: [StorageModule, AuditModule],
  providers: [PrismaService, AppLoggerService, I18nService, AppConfigService],
  exports: [PrismaService, AppLoggerService, I18nService, AppConfigService, StorageModule, AuditModule],
})
export class CoreModule {}
