import { Injectable } from '@nestjs/common';
import { AppSettingsRepository } from './repositories/app-settings.repository';
import { AuditService, AuditAction } from '../../core/audit/audit.service';

@Injectable()
export class AppSettingsService {
  constructor(
    private readonly settingsRepo: AppSettingsRepository,
    private readonly audit: AuditService,
  ) {}

  async findAll(category?: string) {
    return this.settingsRepo.findAll(category);
  }

  async findByKey(key: string) {
    return this.settingsRepo.findByKey(key);
  }

  async getValue(key: string): Promise<any> {
    const setting = await this.settingsRepo.findByKey(key);
    return setting?.value ?? null;
  }

  async getValuesByCategory(category: string): Promise<Record<string, any>> {
    return this.settingsRepo.getValuesByCategory(category);
  }

  async upsert(key: string, value: any, category?: string, description?: string, userId?: string) {
    const result = await this.settingsRepo.upsert(key, value, category, description);

    if (userId) {
      await this.audit.log({
        userId,
        action: AuditAction.APP_SETTINGS_UPDATE,
        entityType: 'app_settings',
        entityId: key,
        metadata: { key, category },
      });
    }

    return result;
  }

  async bulkUpdate(items: Array<{
    key: string;
    value: any;
    category?: string;
    description?: string;
  }>, userId?: string) {
    const results = await this.settingsRepo.bulkUpdate(items);

    if (userId) {
      await this.audit.log({
        userId,
        action: AuditAction.APP_SETTINGS_UPDATE,
        entityType: 'app_settings',
        entityId: 'bulk',
        metadata: { keys: items.map(i => i.key) },
      });
    }

    return results;
  }

  async delete(key: string, userId?: string) {
    await this.settingsRepo.delete(key);

    if (userId) {
      await this.audit.log({
        userId,
        action: AuditAction.APP_SETTINGS_UPDATE,
        entityType: 'app_settings',
        entityId: key,
        metadata: { deleted: true },
      });
    }

    return { success: true };
  }

  // ─── Convenience methods ──────────────────────────────────────────

  async isWhatsAppEnabled(): Promise<boolean> {
    const val = await this.getValue('whatsapp_enabled');
    return val === true || val === 'true';
  }

  async isTelegramEnabled(): Promise<boolean> {
    const val = await this.getValue('telegram_enabled');
    return val === true || val === 'true';
  }

  async isEmailEnabled(): Promise<boolean> {
    const val = await this.getValue('email_enabled');
    return val === true || val === 'true';
  }

  async isAdsEnabled(): Promise<boolean> {
    const val = await this.getValue('ads_enabled');
    return val === true || val === 'true';
  }

  async getWhatsAppGatewayConfig(): Promise<{ url: string; token: string }> {
    return {
      url: (await this.getValue('whatsapp_gateway_url')) || '',
      token: (await this.getValue('whatsapp_gateway_token')) || '',
    };
  }

  async getTelegramConfig(): Promise<{ botToken: string }> {
    return {
      botToken: (await this.getValue('telegram_bot_token')) || '',
    };
  }

  async getEmailConfig(): Promise<{
    host: string;
    port: number;
    user: string;
    password: string;
    fromName: string;
    fromAddress: string;
  }> {
    return {
      host: (await this.getValue('email_smtp_host')) || '',
      port: parseInt((await this.getValue('email_smtp_port')) || '587', 10),
      user: (await this.getValue('email_smtp_user')) || '',
      password: (await this.getValue('email_smtp_password')) || '',
      fromName: (await this.getValue('email_from_name')) || 'Тойға',
      fromAddress: (await this.getValue('email_from_address')) || '',
    };
  }

  async getAdsConfig(): Promise<{
    enabled: boolean;
    imageUrl: string;
    bannerUrl: string;
    height: number;
    position: string;
  }> {
    return {
      enabled: await this.isAdsEnabled(),
      imageUrl: (await this.getValue('ads_image_url')) || '',
      bannerUrl: (await this.getValue('ads_banner_url')) || '',
      height: parseInt((await this.getValue('ads_height')) || '90', 10),
      position: (await this.getValue('ads_position')) || 'bottom',
    };
  }
}
