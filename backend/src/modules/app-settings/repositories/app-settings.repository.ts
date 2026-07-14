import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma.service';

@Injectable()
export class AppSettingsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(category?: string) {
    const where: any = {};
    if (category) where.category = category;

    return this.prisma.app_settings.findMany({
      where,
      orderBy: [{ category: 'asc' }, { key: 'asc' }],
    });
  }

  async findByKey(key: string) {
    return this.prisma.app_settings.findUnique({
      where: { key },
    });
  }

  async getValuesByCategory(category: string): Promise<Record<string, any>> {
    const settings = await this.prisma.app_settings.findMany({
      where: { category },
    });

    const result: Record<string, any> = {};
    for (const setting of settings) {
      result[setting.key] = setting.value;
    }
    return result;
  }

  async upsert(key: string, value: any, category?: string, description?: string) {
    return this.prisma.app_settings.upsert({
      where: { key },
      create: { key, value, category: category || 'general', description },
      update: { value, ...(category && { category }), ...(description && { description }) },
    });
  }

  async bulkUpdate(items: Array<{
    key: string;
    value: any;
    category?: string;
    description?: string;
  }>) {
    const results = [];
    for (const item of items) {
      const result = await this.upsert(item.key, item.value, item.category, item.description);
      results.push(result);
    }
    return results;
  }

  async delete(key: string) {
    return this.prisma.app_settings.delete({
      where: { key },
    });
  }
}
