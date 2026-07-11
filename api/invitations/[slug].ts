import type { VercelResponse } from '@vercel/node';
import { withHandler } from '../_core';
import { eventService } from '../../src/core/factories';
import { NotFoundError } from '../_core/errors';

export default withHandler(
  async (req, res: VercelResponse) => {
    if (req.method === 'GET') {
      const { slug } = req.query;

      if (!slug || typeof slug !== 'string') {
        throw new NotFoundError('Invitation');
      }

      const event = await eventService.getEventBySlug(slug);
      res.status(200).json(event);
      return;
    }
  },
  {
    methods: ['GET'],
  }
);
