import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import qrcode from 'qrcode';
import { session } from './session.js';
import { requireAuth } from './auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Public health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// Status of connection (Public or secured depending on preference; let's keep public status check for system monitoring)
app.get('/status', (req, res) => {
  res.json({
    status: session.status,
    hasQr: !!session.qrCode,
  });
});

// Render QR code in browser (public endpoint to scan QR)
app.get('/qr', async (req, res) => {
  if (session.status === 'connected') {
    res.send('<html><body style="font-family:sans-serif; text-align:center; padding:50px;"><h2>WhatsApp is already connected!</h2></body></html>');
    return;
  }

  if (!session.qrCode) {
    res.send('<html><body style="font-family:sans-serif; text-align:center; padding:50px;"><h2>QR code is generating, please refresh in a few seconds...</h2><script>setTimeout(function(){location.reload()}, 3000)</script></body></html>');
    return;
  }

  try {
    const qrImage = await qrcode.toDataURL(session.qrCode);
    res.send(`
      <html>
        <body style="font-family: sans-serif; text-align: center; background: #f0f2f5; padding: 40px; margin: 0;">
          <div style="background: white; display: inline-block; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); margin-top: 50px;">
            <h1 style="color: #075e54; margin-top: 0;">Toyga WhatsApp Gateway</h1>
            <p style="color: #666; max-width: 320px; margin: 0 auto 20px auto;">Scan this QR code with WhatsApp Web on your phone to link your account.</p>
            <img src="${qrImage}" style="width: 250px; height: 250px; border: 1px solid #ddd; border-radius: 8px; padding: 5px; background: white;" />
            <div style="margin-top: 20px; font-size: 14px; color: #888;">
              Status: <span style="font-weight: bold; color: #e74c3c;">Disconnected</span>
            </div>
            <script>
              // Poll status every 3 seconds, reload when connected
              setInterval(async () => {
                try {
                  const res = await fetch('/status');
                  const data = await res.json();
                  if (data.status === 'connected') {
                    location.reload();
                  }
                } catch(e) {}
              }, 3000);
            </script>
          </div>
        </body>
      </html>
    `);
  } catch (err) {
    console.error('Error generating QR image:', err);
    res.status(500).send('Failed to load QR code');
  }
});

// Secure message sending endpoint
app.post('/send', requireAuth, async (req, res) => {
  const { phone, message } = req.body;

  if (!phone || !message) {
    res.status(400).json({ error: 'Missing phone or message parameter' });
    return;
  }

  if (session.status !== 'connected') {
    res.status(503).json({ error: 'WhatsApp Gateway is not connected' });
    return;
  }

  const result = await session.sendMessage(phone, message);
  if (result) {
    res.json({ success: true });
  } else {
    res.status(500).json({ error: 'Failed to send WhatsApp message' });
  }
});

// Start WhatsApp Gateway and express server
app.listen(PORT, async () => {
  console.log(`[WHATSAPP GATEWAY] Server is running on port ${PORT}`);
  try {
    await session.connect();
  } catch (err) {
    console.error('Failed to initialize Baileys session:', err);
  }
});
