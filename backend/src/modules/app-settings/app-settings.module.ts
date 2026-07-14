import { Module } from '@nestjs/common';
import { AppSettingsController } from './app-settings.controller';
import { AppSettingsService } from './app-settings.service';
import { AppSettingsRepository } from './repositories/app-settings.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AppSettingsController],
  providers: [AppSettingsService, AppSettingsRepository],
  exports: [AppSettingsService],
})
export class AppSettingsModule {}
