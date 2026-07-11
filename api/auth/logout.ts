import type { VercelResponse } from '@vercel/node';
import { withHandler, clearTokenCookie } from '../_core';

export default withHandler(
  async (_req, res: VercelResponse) => {
    res.setHeader('Set-Cookie', clearTokenCookie());
    res.status(200).json({ success: true });
  },
  {
    methods: ['POST', 'DELETE'],
  }
);
