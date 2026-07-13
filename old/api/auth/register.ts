import type { VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import { withHandler, query, createUserToken, setTokenCookie } from '../_core';
import { registerSchema } from '../../src/core/validation';
import { ConflictError, ValidationError } from '../_core/errors';

export default withHandler(
  async (req, res: VercelResponse) => {
    // 1. Validate parameters
    const { name, email, password } = registerSchema.parse(req.body);
    const normalizedEmail = email.toLowerCase().trim();

    // 2. Check if email is already registered
    const { rows: existing } = await query(
      'SELECT id FROM users WHERE email = $1 LIMIT 1',
      [normalizedEmail]
    );

    if (existing.length > 0) {
      throw new ConflictError('User with this email address already exists.', 'email');
    }

    // 3. Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // 4. Create user
    const { rows: created } = await query<{
      id: string;
      name: string;
      email: string;
    }>(
      `INSERT INTO users (name, email, password_hash, auth_provider, status)
       VALUES ($1, $2, $3, 'password', 'active')
       RETURNING id, name, email`,
      [name.trim(), normalizedEmail, passwordHash]
    );

    const user = created[0];
    if (!user) {
      throw new ValidationError('Database error during registration.');
    }

    // 5. Generate token
    const token = createUserToken(parseInt(user.id), user.email);

    // 6. Set HttpOnly session cookie
    res.setHeader('Set-Cookie', setTokenCookie(token));

    res.status(201).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  },
  {
    methods: ['POST'],
  }
);
