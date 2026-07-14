import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma.service';

@Injectable()
export class CategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.categories.findMany({
      where: { deletedAt: null },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findById(id: string) {
    return this.prisma.categories.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.categories.findFirst({
      where: { slug, deletedAt: null },
    });
  }

  async create(data: { name: string; slug: string; description?: string; imageUrl?: string; sortOrder?: number }) {
    return this.prisma.categories.create({ data });
  }

  async update(id: string, data: { name?: string; slug?: string; description?: string; imageUrl?: string; sortOrder?: number }) {
    return this.prisma.categories.update({ where: { id }, data });
  }

  async softDelete(id: string) {
    return this.prisma.categories.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
