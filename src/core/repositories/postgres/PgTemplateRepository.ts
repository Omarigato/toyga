import type { ITemplateRepository, DbTemplate } from '../interfaces/ITemplateRepository';
import type { CreateTemplateInput, UpdateTemplateInput } from '../../validation/templates';
import { query } from '../../../../api/_core/db';

export class PgTemplateRepository implements ITemplateRepository {
  async findAll(filters: { categorySlug?: string; activeOnly?: boolean }): Promise<DbTemplate[]> {
    let sql = `
      SELECT t.*, c.slug as category_slug, c.title_kk as category_title
      FROM templates t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.deleted_at IS NULL
    `;
    const params: any[] = [];

    if (filters.activeOnly) {
      sql += ' AND t.is_active = true';
    }

    if (filters.categorySlug) {
      params.push(filters.categorySlug);
      sql += ` AND c.slug = $${params.length}`;
    }

    sql += ' ORDER BY t.sort_order ASC, t.id ASC';

    const { rows } = await query<DbTemplate>(sql, params);
    return rows;
  }

  async findById(id: number): Promise<DbTemplate | null> {
    const { rows } = await query<DbTemplate>(
      `SELECT t.*, c.slug as category_slug, c.title_kk as category_title
       FROM templates t
       LEFT JOIN categories c ON t.category_id = c.id
       WHERE t.id = $1 AND t.deleted_at IS NULL
       LIMIT 1`,
      [id]
    );
    return rows[0] || null;
  }

  async findByCode(code: string): Promise<DbTemplate | null> {
    const { rows } = await query<DbTemplate>(
      `SELECT t.*, c.slug as category_slug, c.title_kk as category_title
       FROM templates t
       LEFT JOIN categories c ON t.category_id = c.id
       WHERE t.code = $1 AND t.deleted_at IS NULL
       LIMIT 1`,
      [code]
    );
    return rows[0] || null;
  }

  async create(data: CreateTemplateInput): Promise<DbTemplate> {
    const { rows } = await query<DbTemplate>(
      `INSERT INTO templates (
         category_id, code, title_kk, title_ru, preview_img, envelope_img, 
         base_img, content, design_tokens, price, is_premium, is_active, sort_order, source
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       RETURNING *`,
      [
        data.category_id || null,
        data.code || null,
        data.title_kk,
        data.title_ru || null,
        data.preview_img || null,
        data.envelope_img || null,
        data.base_img || null,
        data.content ? JSON.stringify(data.content) : null,
        data.design_tokens ? JSON.stringify(data.design_tokens) : null,
        data.price || 0,
        data.is_premium || false,
        data.is_active ?? true,
        data.sort_order || 0,
        data.source || null,
      ]
    );
    return rows[0];
  }

  async update(id: number, data: UpdateTemplateInput): Promise<DbTemplate | null> {
    const { rows } = await query<DbTemplate>(
      `UPDATE templates
       SET category_id = COALESCE($1, category_id),
           code = COALESCE($2, code),
           title_kk = COALESCE($3, title_kk),
           title_ru = COALESCE($4, title_ru),
           preview_img = COALESCE($5, preview_img),
           envelope_img = COALESCE($6, envelope_img),
           base_img = COALESCE($7, base_img),
           content = COALESCE($8, content),
           design_tokens = COALESCE($9, design_tokens),
           price = COALESCE($10, price),
           is_premium = COALESCE($11, is_premium),
           is_active = COALESCE($12, is_active),
           sort_order = COALESCE($13, sort_order),
           source = COALESCE($14, source),
           updated_at = NOW()
       WHERE id = $15 AND deleted_at IS NULL
       RETURNING *`,
      [
        data.category_id || null,
        data.code || null,
        data.title_kk || null,
        data.title_ru || null,
        data.preview_img || null,
        data.envelope_img || null,
        data.base_img || null,
        data.content ? JSON.stringify(data.content) : null,
        data.design_tokens ? JSON.stringify(data.design_tokens) : null,
        data.price ?? null,
        data.is_premium ?? null,
        data.is_active ?? null,
        data.sort_order ?? null,
        data.source || null,
        id,
      ]
    );
    return rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const { rowCount } = await query(
      'UPDATE templates SET deleted_at = NOW(), updated_at = NOW() WHERE id = $1 AND deleted_at IS NULL',
      [id]
    );
    return (rowCount ?? 0) > 0;
  }
}
