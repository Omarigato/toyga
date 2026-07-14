import { Injectable, BadRequestException } from '@nestjs/common';
import { WhatsAppRepository } from './repositories/whatsapp.repository';
import { AppConfigService } from '../../core/config/app-config.service';
import { AuditService, AuditAction } from '../../core/audit/audit.service';

@Injectable()
export class WhatsAppService {
  constructor(
    private readonly whatsappRepo: WhatsAppRepository,
    private readonly config: AppConfigService,
    private readonly audit: AuditService,
  ) {}

  async findByEventId(eventId: string) {
    return this.whatsappRepo.findByEventId(eventId);
  }

  async sendMessage(data: {
    eventId: string;
    guestId?: string;
    phone: string;
    message: string;
    userId?: string;
  }) {
    const record = await this.whatsappRepo.create(data);

    try {
      await this.sendToGateway(data.phone, data.message);
      await this.whatsappRepo.updateStatus(record.id, 'sent', new Date());

      if (data.userId) {
        await this.audit.log({
          userId: data.userId,
          action: AuditAction.WHATSAPP_SEND,
          entityType: 'whatsapp_message',
          entityId: record.id,
          metadata: { phone: data.phone, eventId: data.eventId },
        });
      }

      return { success: true, id: record.id };
    } catch (error) {
      await this.whatsappRepo.updateStatus(record.id, 'failed', undefined, error.message);
      await this.whatsappRepo.incrementAttempts(record.id);
      return { success: false, id: record.id, error: error.message };
    }
  }

  async broadcast(data: {
    eventId: string;
    guests: Array<{ guestId: string; phone: string; message: string }>;
    userId?: string;
  }) {
    const messages = data.guests.map((g) => ({
      eventId: data.eventId,
      guestId: g.guestId,
      phone: g.phone,
      message: g.message,
    }));

    await this.whatsappRepo.createMany(messages);

    const results = [];
    for (const guest of data.guests) {
      try {
        await this.sendToGateway(guest.phone, guest.message);
        results.push({ guestId: guest.guestId, success: true });
      } catch (error) {
        results.push({ guestId: guest.guestId, success: false, error: error.message });
      }
    }

    if (data.userId) {
      await this.audit.log({
        userId: data.userId,
        action: AuditAction.WHATSAPP_BROADCAST,
        entityType: 'whatsapp_message',
        entityId: data.eventId,
        metadata: { guestCount: data.guests.length, successCount: results.filter((r) => r.success).length },
      });
    }

    return { success: true, results };
  }

  async sendOtp(phone: string, code: string, lang: string = 'kk') {
    const templates: Record<string, (code: string) => string> = {
      kk: (c) => `Toyga.kz: Сіздің кіру кодыңыз: ${c}. Кодты ешкімге бермеңіз. Жарамдылық мерзімі: 5 минут.`,
      ru: (c) => `Toyga.kz: Ваш код для входа: ${c}. Никому не передавайте этот код. Действителен: 5 минут.`,
      en: (c) => `Toyga.kz: Your login code is: ${c}. Do not share this code with anyone. Valid for: 5 minutes.`,
    };

    const template = templates[lang] || templates.kk;
    const message = template(code);

    return this.sendToGateway(phone, message);
  }

  private async sendToGateway(phone: string, message: string): Promise<void> {
    const gatewayUrl = this.config.whatsappGatewayUrl;
    if (!gatewayUrl) {
      console.log(`[WhatsApp] [SIMULATION] To ${phone}: "${message.slice(0, 50)}..."`);
      return;
    }

    const response = await fetch(`${gatewayUrl}/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.whatsappGatewayToken}`,
      },
      body: JSON.stringify({ phone, message }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Gateway returned status ${response.status}`);
    }
  }
}
