import type { Category } from '../../../lib/apiClient';

export interface ICategoryRepository {
  findAll(activeOnly?: boolean): Promise<Category[]>;
  findById(id: number): Promise<Category | null>;
  findBySlug(slug: string): Promise<Category | null>;
  create(data: Partial<Category>): Promise<Category>;
  update(id: number, data: Partial<Category>): Promise<Category | null>;
  delete(id: number): Promise<boolean>;
}
