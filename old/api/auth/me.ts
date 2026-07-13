import type { VercelResponse } from '@vercel/node';
import { withHandler, query, clearTokenCookie } from '../_core';
import { NotFoundError, ForbiddenError } from '../_core/errors';

export default withHandler(
  async (req, res: VercelResponse) => {
    const userId = req.ctx.userId || req.ctx.adminId;

    if (!userId) {
      res.status(200).json({ success: true, user: null });
      return;
    }

    const { rows } = await query<{
      id: string;
      name: string;
      email: string | null;
      phone: string | null;
      avatar_url: string | null;
      status: string;
    }>(
      'SELECT id, name, email, phone, avatar_url, status FROM users WHERE id = $1 LIMIT 1',
      [userId]
    );

    const user = rows[0];
    if (!user) {
      res.setHeader('Set-Cookie', clearTokenCookie());
      throw new NotFoundError('User');
    }

    if (user.status === 'blocked') {
      res.setHeader('Set-Cookie', clearTokenCookie());
      throw new ForbiddenError('Your account has been suspended.');
    }

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar_url: user.avatar_url,
        role: req.ctx.role,
      },
    });
  },
  {
    methods: ['GET'],
    auth: 'any', // Accepts user JWT session or admin JWT session
  }
);
