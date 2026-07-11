import type { VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import { withHandler, query, createUserToken, setTokenCookie } from '../_core';
import { otpVerifySchema, normalizePhone } from '../../src/core/validation';
import { ValidationError, ForbiddenError } from '../_core/errors';
import { SYSTEM_LIMITS } from '../../src/core/constants';

export default withHandler(
  async (req, res: VercelResponse) => {
    // 1. Parse and validate parameters
    const { phone, code, name } = otpVerifySchema.parse(req.body);
    const normalized = normalizePhone(phone);

    // 2. Fetch the latest active OTP code for this phone number
    const { rows: codeRows } = await query<{
      id: string;
      code_hash: string;
      attempts: number;
      expires_at: Date;
    }>(
      `SELECT id, code_hash, attempts, expires_at 
       FROM otp_codes 
       WHERE phone = $1 AND purpose = 'login' AND consumed_at IS NULL AND expires_at > NOW()
       ORDER BY created_at DESC LIMIT 1`,
      [normalized]
    );

    const otpRecord = codeRows[0];
    if (!otpRecord) {
      throw new ValidationError('Verification code has expired or is invalid.');
    }

    // 3. Prevent brute-force checks (max attempts limit)
    if (otpRecord.attempts >= SYSTEM_LIMITS.MAX_OTP_ATTEMPTS) {
      throw new ValidationError('Too many incorrect attempts. Please request a new code.');
    }

    // 4. Verify code hash
    const isValid = await bcrypt.compare(code, otpRecord.code_hash);
    if (!isValid) {
      // Increment verification attempts count in DB
      await query('UPDATE otp_codes SET attempts = attempts + 1 WHERE id = $1', [otpRecord.id]);
      throw new ValidationError('Invalid verification code.');
    }

    // 5. Consume OTP code
    await query('UPDATE otp_codes SET consumed_at = NOW() WHERE id = $1', [otpRecord.id]);

    // 6. Find or create the user in database
    const displayName = name || phone;
    const { rows: userRows } = await query<{
      id: string;
      name: string;
      email: string | null;
      phone: string;
      status: string;
    }>(
      `INSERT INTO users (name, phone, auth_provider, status) 
       VALUES ($1, $2, 'phone_otp', 'active') 
       ON CONFLICT (phone) 
       DO UPDATE SET name = COALESCE(users.name, EXCLUDED.name)
       RETURNING id, name, email, phone, status`,
      [displayName, normalized]
    );

    const user = userRows[0];
    if (!user) {
      throw new ValidationError('Database error creating or finding user.');
    }

    if (user.status === 'blocked') {
      throw new ForbiddenError('Your account has been suspended.');
    }

    // 7. Create authorization JWT token
    const token = createUserToken(parseInt(user.id), user.email || undefined);

    // 8. Set HttpOnly session cookie
    res.setHeader('Set-Cookie', setTokenCookie(token));

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  },
  {
    methods: ['POST'],
  }
);
