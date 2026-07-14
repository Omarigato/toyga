import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from './core/core.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TemplatesModule } from './modules/templates/templates.module';
import { EventsModule } from './modules/events/events.module';
import { MediaModule } from './modules/media/media.module';
import { GuestsModule } from './modules/guests/guests.module';
import { WhatsAppModule } from './modules/whatsapp/whatsapp.module';
import { AdminModule } from './modules/admin/admin.module';
import { HealthModule } from './modules/health/health.module';
import { DictionaryModule } from './modules/dictionary/dictionary.module';
import { AppSettingsModule } from './modules/app-settings/app-settings.module';
import { RequestIdMiddleware } from './core/middleware/request-id.middleware';
import { LoggingMiddleware } from './core/middleware/logging.middleware';
import { LanguageMiddleware } from './core/middleware/language.middleware';
import { SecurityMiddleware } from './core/middleware/security.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CoreModule,
    AuthModule,
    UsersModule,
    TemplatesModule,
    EventsModule,
    MediaModule,
    GuestsModule,
    WhatsAppModule,
    AdminModule,
    HealthModule,
    DictionaryModule,
    AppSettingsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestIdMiddleware, LoggingMiddleware, LanguageMiddleware, SecurityMiddleware)
      .forRoutes('*');
  }
}
