import { getEnv } from '../../../api/_core';
import { NOTIFICATION_TEMPLATES, DEFAULT_LANGUAGE } from '../constants';
import type { SupportedLanguage } from '../constants';

export class NotificationService {
  private static getGatewayUrl(): string {
    const env = getEnv();
    const url = env.WHATSAPP_GATEWAY_URL;
    if (!url) {
      console.warn('[NotificationService] WHATSAPP_GATEWAY_URL is not set. Messages will be logged to console only.');
    }
    return url || '';
  }

  private static getGatewayToken(): string {
    return getEnv().WHATSAPP_GATEWAY_TOKEN || '';
  }

  /**
   * Helper to send POST request to WhatsApp Gateway.
   */
  private static async sendRawMessage(phone: string, message: string): Promise<boolean> {
    const gatewayUrl = this.getGatewayUrl();
    if (!gatewayUrl) {
      console.log(`[NotificationService] [SIMULATION] Sending WhatsApp to ${phone}: "${message}"`);
      return true; // Simulate success in development when gateway isn't deployed
    }

    try {
      const response = await fetch(`${gatewayUrl}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getGatewayToken()}`,
        },
        body: JSON.stringify({ phone, message }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(
          `[NotificationService] Gateway returned status ${response.status}:`,
          errorData.error || 'Unknown gateway error'
        );
        return false;
      }

      console.log(`[NotificationService] Successfully sent message to ${phone}`);
      return true;
    } catch (error) {
      console.error(`[NotificationService] Network error connecting to WhatsApp Gateway at ${gatewayUrl}:`, error);
      return false;
    }
  }

  /**
   * Send One-Time Password (OTP) verification code.
   */
  public static async sendOtp(
    phone: string,
    code: string,
    lang: SupportedLanguage = DEFAULT_LANGUAGE
  ): Promise<boolean> {
    const template = NOTIFICATION_TEMPLATES.OTP[lang] || NOTIFICATION_TEMPLATES.OTP[DEFAULT_LANGUAGE];
    const message = template(code);
    return this.sendRawMessage(phone, message);
  }

  /**
   * Send personal wedding/event invitation to a guest.
   */
  public static async sendInvitation(
    phone: string,
    guestName: string,
    greetingText: string,
    link: string,
    lang: SupportedLanguage = DEFAULT_LANGUAGE
  ): Promise<boolean> {
    const salutation = greetingText || (lang === 'ru' ? `Уважаемый(ая) ${guestName}` : lang === 'en' ? `Dear ${guestName}` : `Құрметті ${guestName}`);
    const template = NOTIFICATION_TEMPLATES.INVITATION[lang] || NOTIFICATION_TEMPLATES.INVITATION[DEFAULT_LANGUAGE];
    const message = template(salutation, link);
    return this.sendRawMessage(phone, message);
  }

  /**
   * Send update notification when details change.
   */
  public static async sendUpdateNotification(
    phone: string,
    guestName: string,
    link: string,
    lang: SupportedLanguage = DEFAULT_LANGUAGE
  ): Promise<boolean> {
    const template = NOTIFICATION_TEMPLATES.UPDATE[lang] || NOTIFICATION_TEMPLATES.UPDATE[DEFAULT_LANGUAGE];
    const message = template(guestName, link);
    return this.sendRawMessage(phone, message);
  }

  /**
   * Send custom text message directly.
   */
  public static async sendCustomMessage(phone: string, text: string): Promise<boolean> {
    return this.sendRawMessage(phone, text);
  }
}
