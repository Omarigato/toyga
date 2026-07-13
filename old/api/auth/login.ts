import type { VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import { withHandler, query, createUserToken, setTokenCookie } from '../_core';
import { loginSchema } from '../../src/core/validation';
import { ValidationError, ForbiddenError } from '../_core/errors';

export default withHandler(
  async (req, res: VercelResponse) => {
    // 1. Validate parameters
    const { email, password } = loginSchema.parse(req.body);
    const normalizedEmail = email.toLowerCase().trim();

    // 2. Fetch user details
    const { rows } = await query<{
      id: string;
      name: string;
      email: string;
      password_hash: string | null;
      status: string;
      auth_provider: string;
    }>(
      'SELECT id, name, email, password_hash, status, auth_provider FROM users WHERE email = $1 LIMIT 1',
      [normalizedEmail]
    );

    const user = rows[0];
    if (!user || !user.password_hash) {
      throw new ValidationError('Invalid email or password.');
    }

    if (user.status === 'blocked') {
      throw new ForbiddenError('Your account has been suspended.');
    }

    // 3. Verify password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      throw new ValidationError('Invalid email or password.');
    }

    // 4. Generate token
    const token = createUserToken(parseInt(user.id), user.email);

    // 5. Set session cookie
    res.setHeader('Set-Cookie', setTokenCookie(token));

    res.status(200).json({
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
