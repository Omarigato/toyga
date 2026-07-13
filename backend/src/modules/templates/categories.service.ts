import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CategoriesRepository } from './repositories/categories.repository';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepo: CategoriesRepository) {}

  async findAll() {
    return this.categoriesRepo.findAll();
  }

  async findById(id: string) {
    const category = await this.categoriesRepo.findById(id);
    if (!category) throw new NotFoundException('CATEGORY_NOT_FOUND');
    return category;
  }

  async findBySlug(slug: string) {
    const category = await this.categoriesRepo.findBySlug(slug);
    if (!category) throw new NotFoundException('CATEGORY_NOT_FOUND');
    return category;
  }

  async create(data: { name: string; slug: string; description?: string; imageUrl?: string; sortOrder?: number }) {
    const existing = await this.categoriesRepo.findBySlug(data.slug);
    if (existing) throw new ConflictException('CATEGORY_SLUG_EXISTS');
    return this.categoriesRepo.create(data);
  }

  async update(id: string, data: { name?: string; slug?: string; description?: string; imageUrl?: string; sortOrder?: number }) {
    await this.findById(id);
    if (data.slug) {
      const existing = await this.categoriesRepo.findBySlug(data.slug);
      if (existing && existing.id !== id) throw new ConflictException('CATEGORY_SLUG_EXISTS');
    }
    return this.categoriesRepo.update(id, data);
  }

  async delete(id: string) {
    await this.findById(id);
    return this.categoriesRepo.softDelete(id);
  }
}
