import type { VercelResponse } from '@vercel/node';
import { withHandler, query } from '../_core';
import { ValidationError } from '../_core/errors';

export default withHandler(
  async (req, res: VercelResponse) => {
    // ─── GET: Fetch Payment Settings ─────────────────────────────────────────
    if (req.method === 'GET') {
      const { rows } = await query(
        'SELECT mode, kaspi_merchant_id, kaspi_api_key_encrypted, manager_whatsapp FROM payment_settings LIMIT 1'
      );

      if (rows.length === 0) {
        res.status(200).json({ mode: 'manual', manager_whatsapp: null });
        return;
      }

      res.status(200).json(rows[0]);
      return;
    }

    // ─── PUT: Update Payment Settings ─────────────────────────────────────────
    if (req.method === 'PUT') {
      const { mode, kaspi_merchant_id, kaspi_api_key_encrypted, manager_whatsapp } = req.body;
      if (!mode) {
        throw new ValidationError('mode field is required');
      }
      if (mode !== 'manual' && mode !== 'auto') {
        throw new ValidationError('mode must be "manual" or "auto"');
      }

      // Check if row already exists
      const { rows: checkRows } = await query('SELECT id FROM payment_settings LIMIT 1');

      if (checkRows.length > 0) {
        const { rows } = await query(
          `UPDATE payment_settings
           SET mode = $1,
               kaspi_merchant_id = $2,
               kaspi_api_key_encrypted = $3,
               manager_whatsapp = $4,
               updated_at = NOW(),
               updated_by = $5
           WHERE id = $6
           RETURNING mode, kaspi_merchant_id, kaspi_api_key_encrypted, manager_whatsapp`,
          [
            mode,
            kaspi_merchant_id || null,
            kaspi_api_key_encrypted || null,
            manager_whatsapp || null,
            req.ctx.adminId || null,
            checkRows[0].id,
          ]
        );
        res.status(200).json(rows[0]);
      } else {
        const { rows } = await query(
          `INSERT INTO payment_settings (mode, kaspi_merchant_id, kaspi_api_key_encrypted, manager_whatsapp, updated_by)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING mode, kaspi_merchant_id, kaspi_api_key_encrypted, manager_whatsapp`,
          [
            mode,
            kaspi_merchant_id || null,
            kaspi_api_key_encrypted || null,
            manager_whatsapp || null,
            req.ctx.adminId || null,
          ]
        );
        res.status(201).json(rows[0]);
      }
      return;
    }
  },
  {
    methods: ['GET', 'PUT'],
    auth: 'admin',
  }
);
