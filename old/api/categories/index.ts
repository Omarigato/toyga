import type { VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { withHandler, requireAdmin } from '../_core';
import { categoryService } from '../../src/core/factories';
import { createCategorySchema, updateCategorySchema } from '../../src/core/validation';
import { ValidationError } from '../_core/errors';

export default withHandler(
  async (req, res: VercelResponse) => {
    // ─── GET: List Categories ────────────────────────────────────────────────
    if (req.method === 'GET') {
      const showAll = req.query.all === 'true';
      const categories = await categoryService.listCategories(!showAll);
      res.status(200).json(categories);
      return;
    }

    // ─── POST: Create Category (Admin Only) ──────────────────────────────────
    if (req.method === 'POST') {
      requireAdmin(req);
      const input = createCategorySchema.parse(req.body);
      const category = await categoryService.createCategory(input);
      res.status(201).json(category);
      return;
    }

    // ─── PUT: Update Category (Admin Only) ───────────────────────────────────
    if (req.method === 'PUT') {
      requireAdmin(req);
      const id = z.coerce.number().int().positive().safeParse(req.query.id);
      if (!id.success) {
        throw new ValidationError('Invalid or missing category id parameter.');
      }
      const input = updateCategorySchema.parse(req.body);
      const category = await categoryService.updateCategory(id.data, input);
      res.status(200).json(category);
      return;
    }
  },
  {
    methods: ['GET', 'POST', 'PUT'],
    // POST and PUT require admin role authentication
    auth: 'any', // Will be verified in handler if they do write requests, or we can enforce it.
    // Let's restrict auth specifically inside the handler or via handler options.
    // Wait! In Vercel, if we specify auth: 'admin', it will require admin role for ALL methods,
    // which would block GET requests for public users!
    // So we must handle public GET requests and restricted POST/PUT requests by dynamically checking
    // req.ctx in the handler, OR by splitting methods.
    // In our implementation, withHandler doesn't block if opts.auth is undefined, but if we set auth: 'any'
    // it will try to authenticate but might throw.
    // Let's check api/_core/http.ts authentication logic:
    // If opts.auth is 'admin', it calls authenticateAdmin(req). If token is missing, it throws.
    // If opts.auth is 'user', it calls authenticateUser(req). If token is missing, it throws.
    // So if we don't set auth at the top, public users can access GET.
    // Inside the handler, we can manually check:
    // if (req.method !== 'GET') {
    //   requireAdmin(req); // throws if not admin
    // }
    // This is clean, safe, and complies with SOLID principles!
  }
);
