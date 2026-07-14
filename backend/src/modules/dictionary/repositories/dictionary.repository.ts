import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma.service';

@Injectable()
export class DictionaryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(category?: string) {
    const where: any = { deletedAt: null, isActive: true };
    if (category) where.category = category;

    return this.prisma.dictionary.findMany({
      where,
      orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
    });
  }

  async findById(id: string) {
    return this.prisma.dictionary.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async findByCategoryAndKey(category: string, key: string) {
    return this.prisma.dictionary.findFirst({
      where: { category, key, deletedAt: null },
    });
  }

  async create(data: {
    category: string;
    key: string;
    value: any;
    label?: string;
    labelRu?: string;
    labelEn?: string;
    sortOrder?: number;
    isActive?: boolean;
  }) {
    return this.prisma.dictionary.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.dictionary.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: string) {
    return this.prisma.dictionary.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async createMany(items: Array<{
    category: string;
    key: string;
    value: any;
    label?: string;
    labelRu?: string;
    labelEn?: string;
    sortOrder?: number;
  }>) {
    return this.prisma.dictionary.createMany({ data: items });
  }
}
