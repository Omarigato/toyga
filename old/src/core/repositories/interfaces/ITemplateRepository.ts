import type { CreateTemplateInput, UpdateTemplateInput } from '../../validation/templates';

// Define DB template structure
export interface DbTemplate {
  id: number;
  category_id: number | null;
  code: string | null;
  title_kk: string;
  title_ru: string | null;
  preview_img: string | null;
  envelope_img: string | null;
  base_img: string | null;
  content: any;
  design_tokens: any;
  price: number;
  is_premium: boolean;
  is_active: boolean;
  sort_order: number;
  source: string | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  category_slug?: string;
  category_title?: string;
}

export interface ITemplateRepository {
  findAll(filters: { categorySlug?: string; activeOnly?: boolean }): Promise<DbTemplate[]>;
  findById(id: number): Promise<DbTemplate | null>;
  findByCode(code: string): Promise<DbTemplate | null>;
  create(data: CreateTemplateInput): Promise<DbTemplate>;
  update(id: number, data: UpdateTemplateInput): Promise<DbTemplate | null>;
  delete(id: number): Promise<boolean>;
}
