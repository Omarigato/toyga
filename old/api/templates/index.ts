import type { VercelResponse } from '@vercel/node';
import { withHandler, requireAdmin } from '../_core';
import { templateService } from '../../src/core/factories';
import { createTemplateSchema } from '../../src/core/validation';

export default withHandler(
  async (req, res: VercelResponse) => {
    // ─── GET: List Templates ─────────────────────────────────────────────────
    if (req.method === 'GET') {
      const { category, all } = req.query;
      const categorySlug = typeof category === 'string' ? category : undefined;
      const activeOnly = all !== 'true';

      const templates = await templateService.listTemplates({
        categorySlug,
        activeOnly,
      });

      res.status(200).json(templates);
      return;
    }

    // ─── POST: Create Template (Admin Only) ──────────────────────────────────
    if (req.method === 'POST') {
      requireAdmin(req);
      const input = createTemplateSchema.parse(req.body);
      const template = await templateService.createTemplate(input);
      res.status(201).json(template);
      return;
    }
  },
  {
    methods: ['GET', 'POST'],
  }
);
