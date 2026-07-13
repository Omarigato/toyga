import type { VercelResponse } from '@vercel/node';
import { withHandler, query } from '../_core';
import { ValidationError, ForbiddenError } from '../_core/errors';

export default withHandler(
  async (req, res: VercelResponse) => {
    // ─── GET: Fetch Orders ───────────────────────────────────────────────────
    if (req.method === 'GET') {
      if (req.ctx.role !== 'admin') {
        // Regular users get their own orders
        const { rows } = await query(
          `SELECT o.*, e.title as event_title 
           FROM orders o
           LEFT JOIN events e ON o.event_id = e.id
           WHERE o.user_id = $1
           ORDER BY o.created_at DESC`,
          [req.ctx.userId]
        );
        res.status(200).json(rows);
        return;
      }

      // Admins retrieve all orders
      const { rows } = await query(
        `SELECT o.*, e.title as event_title, u.name as user_name, u.phone as user_phone
         FROM orders o
         LEFT JOIN events e ON o.event_id = e.id
         LEFT JOIN users u ON o.user_id = u.id
         ORDER BY o.created_at DESC`
      );
      res.status(200).json(rows);
      return;
    }

    // ─── POST: Create Order ──────────────────────────────────────────────────
    if (req.method === 'POST') {
      const { event_id, amount, provider, provider_payment_id } = req.body;
      if (!event_id || !amount) {
        throw new ValidationError('event_id and amount are required');
      }

      const targetUserId = req.ctx.userId || req.ctx.adminId;
      if (!targetUserId) {
        throw new ValidationError('User ID is missing');
      }

      // Verify event ownership for non-admins
      if (req.ctx.role !== 'admin') {
        const { rows: eventRows } = await query(
          'SELECT user_id FROM events WHERE id = $1 AND deleted_at IS NULL',
          [event_id]
        );
        if (eventRows.length === 0) {
          throw new ValidationError('Event not found');
        }
        if (parseInt(eventRows[0].user_id) !== req.ctx.userId) {
          throw new ForbiddenError('You do not own this event');
        }
      }

      const { rows } = await query(
        `INSERT INTO orders (event_id, user_id, amount, status, provider, provider_payment_id)
         VALUES ($1, $2, $3, 'pending', $4, $5)
         RETURNING id`,
        [event_id, req.ctx.userId || targetUserId, amount, provider || 'kaspi_manual', provider_payment_id || null]
      );

      // Transition event to 'pending_payment'
      await query(
        "UPDATE events SET status = 'pending_payment' WHERE id = $1",
        [event_id]
      );

      res.status(201).json({ success: true, orderId: rows[0].id });
      return;
    }
  },
  {
    methods: ['GET', 'POST'],
    auth: 'any',
  }
);
