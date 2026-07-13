import type { ICategoryRepository } from '../interfaces/ICategoryRepository';
import type { Category } from '../../../lib/apiClient';
import { query } from '../../../../api/_core/db';

export class PgCategoryRepository implements ICategoryRepository {
  async findAll(activeOnly = false): Promise<Category[]> {
    let sql = 'SELECT id, slug, title_kk, icon_url as image_url, sort_order FROM categories WHERE deleted_at IS NULL';
    const params: any[] = [];

    if (activeOnly) {
      sql += ' AND is_active = true';
    }

    sql += ' ORDER BY sort_order ASC, id ASC';

    const { rows } = await query<Category>(sql, params);
    return rows;
  }

  async findById(id: number): Promise<Category | null> {
    const { rows } = await query<Category>(
      'SELECT id, slug, title_kk, icon_url as image_url, sort_order FROM categories WHERE id = $1 AND deleted_at IS NULL LIMIT 1',
      [id]
    );
    return rows[0] || null;
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const { rows } = await query<Category>(
      'SELECT id, slug, title_kk, icon_url as image_url, sort_order FROM categories WHERE slug = $1 AND deleted_at IS NULL LIMIT 1',
      [slug]
    );
    return rows[0] || null;
  }

  async create(data: Partial<Category>): Promise<Category> {
    const { rows } = await query<Category>(
      `INSERT INTO categories (slug, title_kk, icon_url, sort_order)
       VALUES ($1, $2, $3, $4)
       RETURNING id, slug, title_kk, icon_url, sort_order`,
      [data.slug, data.title_kk, data.image_url || null, data.sort_order || 0]
    );
    return rows[0];
  }

  async update(id: number, data: Partial<Category>): Promise<Category | null> {
    const { rows } = await query<Category>(
      `UPDATE categories
       SET slug = COALESCE($1, slug),
           title_kk = COALESCE($2, title_kk),
           icon_url = COALESCE($3, icon_url),
           sort_order = COALESCE($4, sort_order),
           updated_at = NOW()
       WHERE id = $5 AND deleted_at IS NULL
       RETURNING id, slug, title_kk, icon_url, sort_order`,
      [data.slug || null, data.title_kk || null, data.image_url || null, data.sort_order ?? null, id]
    );
    return rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const { rowCount } = await query(
      'UPDATE categories SET deleted_at = NOW(), updated_at = NOW() WHERE id = $1 AND deleted_at IS NULL',
      [id]
    );
    return (rowCount ?? 0) > 0;
  }
}
