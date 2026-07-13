import type { VercelResponse } from '@vercel/node';
import { withHandler, query } from '../../_core';
import { ValidationError, NotFoundError } from '../../_core/errors';

export default withHandler(
  async (req, res: VercelResponse) => {
    const { id } = req.query;
    const orderId = parseInt(id as string);
    if (isNaN(orderId)) {
      throw new ValidationError('Invalid order id');
    }

    if (req.method === 'PATCH') {
      const { status } = req.body;
      if (status !== 'paid' && status !== 'cancelled' && status !== 'pending' && status !== 'refunded') {
        throw new ValidationError('Invalid status value');
      }

      // Fetch order details
      const { rows: orderRows } = await query<{ event_id: string }>(
        'SELECT event_id FROM orders WHERE id = $1',
        [orderId]
      );
      if (orderRows.length === 0) {
        throw new NotFoundError('Order');
      }

      const eventId = parseInt(orderRows[0].event_id);

      // Update status
      await query(
        'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2',
        [status, orderId]
      );

      // Publish the event upon successful manual payment confirmation
      if (status === 'paid') {
        await query(
          "UPDATE events SET status = 'published', updated_at = NOW() WHERE id = $1",
          [eventId]
        );
      }

      res.status(200).json({ success: true });
      return;
    }
  },
  {
    methods: ['PATCH'],
    auth: 'admin',
  }
);
