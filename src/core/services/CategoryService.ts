import type { ICategoryRepository } from '../repositories/interfaces/ICategoryRepository';
import type { Category } from '../../lib/apiClient';
import { NotFoundError } from '../../../api/_core/errors';

export class CategoryService {
  constructor(private categoryRepo: ICategoryRepository) {}

  async listCategories(activeOnly = false): Promise<Category[]> {
    return this.categoryRepo.findAll(activeOnly);
  }

  async getCategoryById(id: number): Promise<Category> {
    const category = await this.categoryRepo.findById(id);
    if (!category) {
      throw new NotFoundError('Category', id);
    }
    return category;
  }

  async createCategory(data: Partial<Category>): Promise<Category> {
    return this.categoryRepo.create(data);
  }

  async updateCategory(id: number, data: Partial<Category>): Promise<Category> {
    const category = await this.categoryRepo.update(id, data);
    if (!category) {
      throw new NotFoundError('Category', id);
    }
    return category;
  }

  async deleteCategory(id: number): Promise<void> {
    const deleted = await this.categoryRepo.delete(id);
    if (!deleted) {
      throw new NotFoundError('Category', id);
    }
  }
}
