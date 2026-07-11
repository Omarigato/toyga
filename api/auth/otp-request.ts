import type { VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import { withHandler, query } from '../_core';
import { otpRequestSchema, normalizePhone } from '../../src/core/validation';
import { NotificationService } from '../../src/core/services/NotificationService';
import { ValidationError } from '../_core/errors';

export default withHandler(
  async (req, res: VercelResponse) => {
    // 1. Validate request body
    const { phone, purpose } = otpRequestSchema.parse(req.body);
    const normalized = normalizePhone(phone);

    // 2. Generate 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // 3. Hash code for database security
    const codeHash = await bcrypt.hash(code, 8);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes TTL

    // 4. Save to otp_codes table
    await query(
      `INSERT INTO otp_codes (phone, code_hash, purpose, expires_at)
       VALUES ($1, $2, $3, $4)`,
      [normalized, codeHash, purpose, expiresAt]
    );

    // 5. Send message via NotificationService
    // Read optional language headers or fallback to kk
    const acceptLanguage = req.headers['accept-language']?.split(',')[0]?.substring(0, 2) || 'kk';
    const lang = ['kk', 'ru', 'en'].includes(acceptLanguage) ? (acceptLanguage as 'kk' | 'ru' | 'en') : 'kk';

    const sent = await NotificationService.sendOtp(normalized, code, lang);
    if (!sent) {
      throw new ValidationError('Failed to send verification code. Please verify the phone number.');
    }

    res.status(200).json({ success: true });
  },
  {
    methods: ['POST'],
    // Limit rate of OTP requests to prevent spam (3 requests per 2 minutes per IP)
    rateLimit: {
      windowMs: 2 * 60 * 1000,
      max: 3,
    },
  }
);
