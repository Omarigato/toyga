import type { VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import { withHandler, query, createAdminToken, setTokenCookie } from '../_core';
import { ValidationError } from '../_core/errors';
import { z } from 'zod';

const adminLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export default withHandler(
  async (req, res: VercelResponse) => {
    // Validate request parameters
    const { email, password } = adminLoginSchema.parse(req.body);
    const normalizedEmail = email.toLowerCase().trim();

    // Query for existing admin
    const { rows } = await query<{
      id: string;
      email: string;
      password_hash: string;
    }>(
      'SELECT id, email, password_hash FROM admins WHERE email = $1 LIMIT 1',
      [normalizedEmail]
    );

    const admin = rows[0];
    if (!admin) {
      throw new ValidationError('Invalid email or password.');
    }

    // Verify password
    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid) {
      throw new ValidationError('Invalid email or password.');
    }

    // Create session token
    const token = createAdminToken(parseInt(admin.id), admin.email);

    // Set cookie header
    res.setHeader('Set-Cookie', setTokenCookie(token));

    res.status(200).json({ ok: true });
  },
  {
    methods: ['POST'],
  }
);
