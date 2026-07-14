import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private config: ConfigService) {}

  get databaseUrl(): string {
    return this.config.get<string>('DATABASE_URL', '');
  }

  get jwtSecret(): string {
    return this.config.get<string>('JWT_SECRET', '');
  }

  get jwtExpiresIn(): string {
    return this.config.get<string>('JWT_EXPIRES_IN', '15m');
  }

  get jwtRefreshExpiresIn(): string {
    return this.config.get<string>('JWT_REFRESH_EXPIRES_IN', '30d');
  }

  get googleClientId(): string {
    return this.config.get<string>('GOOGLE_CLIENT_ID', '');
  }

  get googleClientSecret(): string {
    return this.config.get<string>('GOOGLE_CLIENT_SECRET', '');
  }

  get googleRedirectUri(): string {
    return this.config.get<string>('GOOGLE_REDIRECT_URI', '');
  }

  get googleDriveClientEmail(): string {
    return this.config.get<string>('GOOGLE_DRIVE_CLIENT_EMAIL', '');
  }

  get googleDrivePrivateKey(): string {
    return this.config.get<string>('GOOGLE_DRIVE_PRIVATE_KEY', '').replace(/\\n/g, '\n');
  }

  get googleDriveFolderId(): string {
    return this.config.get<string>('GOOGLE_DRIVE_FOLDER_ID', '');
  }

  get whatsappGatewayUrl(): string {
    return this.config.get<string>('WHATSAPP_GATEWAY_URL', '');
  }

  get whatsappGatewayToken(): string {
    return this.config.get<string>('WHATSAPP_GATEWAY_TOKEN', '');
  }

  get nodeEnv(): string {
    return this.config.get<string>('NODE_ENV', 'development');
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get appUrl(): string {
    return this.config.get<string>('APP_URL', 'http://localhost:3000');
  }
}
