import type { VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { withHandler, requireAdmin } from '../_core';
import { templateService } from '../../src/core/factories';
import { updateTemplateSchema } from '../../src/core/validation';
import { ValidationError } from '../_core/errors';

export default withHandler(
  async (req, res: VercelResponse) => {
    // 1. Validate ID param
    const idParse = z.coerce.number().int().positive().safeParse(req.query.id);
    if (!idParse.success) {
      throw new ValidationError('Invalid template id parameter.');
    }
    const id = idParse.data;

    // ─── GET: Fetch Single Template ──────────────────────────────────────────
    if (req.method === 'GET') {
      const template = await templateService.getTemplateById(id);
      res.status(200).json(template);
      return;
    }

    // ─── PUT: Update Template (Admin Only) ───────────────────────────────────
    if (req.method === 'PUT') {
      requireAdmin(req);
      const input = updateTemplateSchema.parse(req.body);
      const template = await templateService.updateTemplate(id, input);
      res.status(200).json(template);
      return;
    }

    // ─── DELETE: Soft Delete Template (Admin Only) ───────────────────────────
    if (req.method === 'DELETE') {
      requireAdmin(req);
      await templateService.deleteTemplate(id);
      res.status(204).end();
      return;
    }
  },
  {
    methods: ['GET', 'PUT', 'DELETE'],
  }
);
