import makeWASocket, { DisconnectReason, useMultiFileAuthState } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import path from 'path';
import fs from 'fs';
import pino from 'pino';

// Custom pino logger to silence heavy debug messages from Baileys
const logger = pino({ level: 'info' });

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';

export interface GatewaySession {
  sock: ReturnType<typeof makeWASocket> | null;
  status: ConnectionStatus;
  qrCode: string | null;
  connect(): Promise<void>;
  sendMessage(phone: string, text: string): Promise<boolean>;
}

const authFolder = path.resolve(process.cwd(), 'auth_info_baileys');

export const session: GatewaySession = {
  sock: null,
  status: 'disconnected',
  qrCode: null,

  async connect() {
    if (this.status === 'connecting' || this.status === 'connected') {
      return;
    }

    this.status = 'connecting';
    console.log('[WHATSAPP GATEWAY] Initializing WhatsApp session...');

    if (!fs.existsSync(authFolder)) {
      fs.mkdirSync(authFolder, { recursive: true });
    }

    const { state, saveCreds } = await useMultiFileAuthState(authFolder);

    const sock = makeWASocket({
      auth: state,
      printQRInTerminal: true,
      logger,
    });

    this.sock = sock;

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update: any) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        console.log('[WHATSAPP GATEWAY] New QR code generated.');
        this.qrCode = qr;
      }

      if (connection === 'connecting') {
        this.status = 'connecting';
      }

      if (connection === 'open') {
        this.status = 'connected';
        this.qrCode = null;
        console.log('[WHATSAPP GATEWAY] Connection established successfully!');
      }

      if (connection === 'close') {
        this.status = 'disconnected';
        this.sock = null;

        const shouldReconnect =
          (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;

        console.log(
          `[WHATSAPP GATEWAY] Connection closed due to: ${lastDisconnect?.error || 'unknown'}. Reconnecting: ${shouldReconnect}`
        );

        if (shouldReconnect) {
          // Reconnect after 5 seconds to prevent tight loops
          setTimeout(() => this.connect(), 5000);
        } else {
          console.log('[WHATSAPP GATEWAY] Logged out. Auth folder needs to be deleted or re-scanned.');
          // Clear auth folder
          try {
            fs.rmSync(authFolder, { recursive: true, force: true });
          } catch (e) {
            console.error('Failed to clean auth folder:', e);
          }
          // Re-initialize for new QR scan
          setTimeout(() => this.connect(), 2000);
        }
      }
    });
  },

  async sendMessage(phone: string, text: string): Promise<boolean> {
    if (this.status !== 'connected' || !this.sock) {
      console.warn('[WHATSAPP GATEWAY] Cannot send message: not connected.');
      return false;
    }

    // Format phone to WhatsApp JID.
    // Standard WhatsApp format: 77001234567@s.whatsapp.net (without + or brackets)
    let cleanPhone = phone.replace(/\D/g, '');
    
    // Convert leading 8 to 7 for Kazakhstan numbers
    if (cleanPhone.startsWith('8') && cleanPhone.length === 11) {
      cleanPhone = '7' + cleanPhone.substring(1);
    }
    
    const jid = `${cleanPhone}@s.whatsapp.net`;

    try {
      console.log(`[WHATSAPP GATEWAY] Sending message to ${jid}: "${text.slice(0, 30)}..."`);
      await this.sock.sendMessage(jid, { text });
      return true;
    } catch (error) {
      console.error(`[WHATSAPP GATEWAY] Failed to send message to ${jid}:`, error);
      return false;
    }
  },
};
